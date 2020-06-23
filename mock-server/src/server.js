const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const fs = require('fs');
const faker = require('faker');

const PORT = 9998;
const DATA_FILE = './commitments.json';

const DIRECTION_ASC = 'ASC';
const DIRECTION_DSC = 'DSC';

const STATUS_ACTIVE = 'ACTIVE';
const STATUS_CANCELED = 'CANCELED';
const STATUS_STOPPED = 'STOPPED';

// taken from SPC graphql data model for rendering a recurring commitments table
const EXAMPLE = {
  pagination: {
    totalCount: 1,
  },
  commitments: [
    {
      organizationId: 12363,
      id: '21d79074-f01c-40cd-a74e-93fa758e5568',
      firstName: 'Benjamin',
      lastName: 'Brown',
      email: 'benjamin.t.brown@hotmail.com',
      amountPaidToDate: 1000,
      pledgeAmount: null,
      currency: 'USD',
      status: 'ACTIVE',
      schedules: [
        {
          id: '5dc7236e-9b2a-4d5b-92c1-c59b86120b06',
          nextPaymentTimestamp: '2020-07-04T09:35:00Z',
          recurringAmount: 1000,
          frequency: 'MONTH',
          status: 'ACTIVE',
        },
      ],
    },
  ],
};

const randomId = () => {
  const set = 'abcdefghijklmnopqrstuvwxyz1234567890';
  let ret = '';
  for (let i = 0; i < 10; i++) {
    ret += set[Math.floor(Math.random() * set.length)];
  }
  return ret;
};

const log = function () {
  console.log.apply(console, [
    `[${new Date().toISOString()}][MOCK SERVER]`,
    ...arguments,
  ]);
};

const validateCommitmentsParams = params => {
  const ret = {
    errors: [],
    valid: false,
    params,
  };

  if (params.statuses) {
    const statusesArr = params.statuses.split(',');
    statusesArr.forEach(status => {
      const statuses = [STATUS_ACTIVE, STATUS_CANCELED, STATUS_STOPPED];
      if (!statuses.includes(status)) {
        ret.errors.push(
          `Invalid filter status: "${status}".  Must be one of ${statuses}`
        );
      }
    });
    ret.params.statuses = statusesArr;
  }

  if (params.sortField) {
    const example = EXAMPLE.commitments[0];
    const values = Object.keys(example).filter(key => {
      return key !== 'pledgeAmount' || key !== 'schedules';
    });
    if (!example[params.sortField]) {
      ret.errors.push(
        `Invalid sort field "${params.sortField}".  Must be one of ${values}`
      );
    }
  }
  if (params.sortDirection) {
    const sortDirections = [DIRECTION_ASC, DIRECTION_DSC];
    if (!sortDirections.includes(params.sortDirection)) {
      ret.errors.push(
        `Invalid sort field "${params.sortDirection}".  Must be one of ${sortDirections}`
      );
    }
  }

  if (params.limit !== undefined) {
    const limit = parseInt(params.limit);
    if (isNaN(limit)) {
      ret.errors.push('Limit must be a number.');
    }
    ret.params.limit = limit;
  }

  if (params.page !== undefined) {
    const page = parseInt(params.page);
    if (isNaN(page)) {
      ret.errors.push('Page must be a number.');
    }
    ret.params.page = page;
  }

  if (ret.errors.length === 0) {
    ret.valid = true;
  }

  return ret;
};

const sortCommitments = (commitments, field, direction) => {
  return [...commitments].sort((a, b) => {
    const fieldA = a[field];
    const fieldB = b[field];
    if (fieldA < fieldB) {
      return direction === DIRECTION_ASC
        ? -1
        : direction === DIRECTION_DSC
        ? 1
        : -1;
    } else if (fieldB < fieldA) {
      return direction === DIRECTION_ASC
        ? 1
        : direction === DIRECTION_DSC
        ? -1
        : 1;
    } else {
      return direction === DIRECTION_ASC
        ? -1
        : direction === DIRECTION_DSC
        ? 1
        : -1;
    }
  });
};

const generateCommitment = () => {
  const nextPayment = new Date();
  const status =
    Math.random() > 0.15
      ? STATUS_ACTIVE
      : Math.random() > 0.5
      ? STATUS_CANCELED
      : STATUS_STOPPED;
  const amount = Math.floor(Math.random() * 250) * 1000;
  const numMonthsPaid = 1 + Math.floor(Math.random() * 12);
  nextPayment.setMonth(nextPayment.getMonth() + 1);
  const commitment = {
    ...EXAMPLE.commitments[0],
    id: randomId(),
    firstName: faker.name.firstName(),
    lastName: faker.name.lastName(),
    email: faker.internet.email(),
    amountPaidToDate: amount * numMonthsPaid,
    status: status,
    schedules: [
      {
        ...EXAMPLE.commitments[0].schedules[0],
        id: randomId(),
        recurringAmount: amount,
        nextPaymentTimestamp: +nextPayment,
        status,
      },
    ],
  };
  return commitment;
};

const generate = amount => {
  const commitments = [];
  for (let i = 0; i < amount; i++) {
    commitments.push(generateCommitment());
  }
  return commitments;
};

const getTransaction = id => {
  let commitments;
  try {
    commitments = JSON.parse(fs.readFileSync(DATA_FILE));
  } catch (e) {
    log('Failed to load commitment file', e.stack);
    return;
  }

  const l = commitments.length;
  console.log(commitments[0]);
  for (let i = 0; i < l; i++) {
    if (commitments[i]['id'] === id) {
      return commitments[i];
    }
  }
  return -1;
};

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());

app.get('/commitments', async (req, res) => {
  log(`GET/commitments`, req.body);
  const resp = {
    pagination: {
      totalCount: 0,
      pageStart: 0,
      pageEnd: 0,
    },
    commitments: [],
    errors: [],
  };
  let commitments;
  try {
    commitments = JSON.parse(fs.readFileSync(DATA_FILE));
  } catch (e) {
    log('Failed to load commitment file', e.stack);
    res.send(JSON.stringify(resp));
    return;
  }

  const { errors, valid, params } = validateCommitmentsParams(req.query);
  log('Params', params);

  if (!valid) {
    resp.errors = errors;
    res.send(JSON.stringify(resp));
    return;
  }

  if (params.sortField) {
    commitments = sortCommitments(
      commitments,
      params.sortField,
      params.sortDirection
    );
  }

  if (params.statuses) {
    commitments = commitments.filter(c => {
      return params.statuses.includes(c.status);
    });
  }

  if (params.search) {
    const search = params.search.toUpperCase();
    commitments = commitments.filter(c => {
      return (
        c.firstName.toUpperCase().includes(search) ||
        c.lastName.toUpperCase().includes(search) ||
        c.email.toUpperCase().includes(search)
      );
    });
  }

  resp.pagination.totalCount = commitments.length;

  if (params.limit !== undefined) {
    const page = params.page || 0;
    const index = params.limit * page;
    resp.pagination.pageStart = index;
    resp.pagination.pageEnd = index + params.limit - 1;
    commitments = commitments.slice(index, index + params.limit);
  } else {
    resp.pageEnd = resp.pagination.totalCount - 1;
  }

  resp.commitments = commitments;
  res.send(JSON.stringify(resp));
});

app.get('/generate', async (req, res) => {
  log(`GET/generate`, req.body);
  const commitments = generate(100);
  const resp = {
    commitments,
  };
  fs.writeFileSync(DATA_FILE, JSON.stringify(commitments));
  res.send(JSON.stringify(resp));
});

app.get('/transactions/:transactionId', async (req, res) => {
  log(`GET/transactions`, req.body);
  const commitment = getTransaction(req.params.transactionId);
  // Check if commitment was found
  // commitment === -1 ?
  res.send(commitment);
  return;
});

try {
  fs.readFileSync(DATA_FILE);
} catch (e) {
  log('Failed to load commitments.json, generating one now...');
  const commitments = generate(100);
  fs.writeFileSync(DATA_FILE, JSON.stringify(commitments));
}

app.listen(PORT, () => {
  log(`Listening on port ${PORT}`);
});
