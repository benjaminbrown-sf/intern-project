const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const fs = require('fs');
const generate = require('./generate');
const EXAMPLE = require('./example');
const {
  STATUS_ACTIVE,
  STATUS_CANCELED,
  STATUS_STOPPED,
  STATUS_REFUNDED,
  DIRECTION_ASC,
  DIRECTION_DSC,
  STATUS_CODE_BAD_REQUEST,
  STATUS_CODE_NOT_FOUND,
  STATUS_CODE_INTERNAL_SERVER_ERROR,
} = require('./constants');

const PORT = 9998;
const COMMITMENTS_DATA_FILE = './commitments.json';
const TRANSACTIONS_DATA_FILE = './transactions.json';

const log = function () {
  console.log.apply(console, [
    `[${new Date().toISOString()}][MOCK SERVER]`,
    ...arguments,
  ]);
};

const cache = {};

const loadDataJson = function (filePath) {
  if (cache[filePath]) {
    return JSON.parse(JSON.stringify(cache[filePath]));
  }

  let data;
  try {
    data = JSON.parse(fs.readFileSync(filePath));
    cache[filePath] = data;
  } catch (e) {
    log('Failed to load data file', e.stack);
    return null;
  }
  return data;
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
    const example = EXAMPLE.EXAMPLE_COMMITMENT;
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

const getCommitment = id => {
  const commitments = loadDataJson(COMMITMENTS_DATA_FILE);
  if (!commitments) {
    return null;
  }

  const l = commitments.length;
  for (let i = 0; i < l; i++) {
    if (commitments[i].id === id) {
      return commitments[i];
    }
  }
  return null;
};

const getTransaction = id => {
  const transactions = loadDataJson(TRANSACTIONS_DATA_FILE);
  if (!transactions) {
    return null;
  }

  const l = transactions.length;
  for (let i = 0; i < l; i++) {
    if (transactions[i].id === id) {
      return transactions[i];
    }
  }
  return null;
};

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());

app.get('/commitments', async (req, res) => {
  log(`GET/commitments`, JSON.stringify(req.query));
  const resp = {
    pagination: {
      totalCount: 0,
      pageStart: 0,
      pageEnd: 0,
    },
    commitments: [],
    errors: [],
  };
  let commitments = loadDataJson(COMMITMENTS_DATA_FILE);
  if (!commitments) {
    res
      .status(STATUS_CODE_INTERNAL_SERVER_ERROR)
      .send('Failed to load commitments file');
    return;
  }

  const { errors, valid, params } = validateCommitmentsParams(req.query);

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
  res.send(resp);
});

app.get('/generate', async (req, res) => {
  log('GET/generate', req.body);
  const commitments = generate.generateData(100);
  const resp = {
    commitments,
  };
  fs.writeFileSync(COMMITMENTS_DATA_FILE, JSON.stringify(commitments));
  res.send(JSON.stringify(resp));
});

app.get('/commitment/:commitmentId', async (req, res) => {
  log('GET/commitment', req.params.commitmentId);
  let { commitmentId } = req.params;
  const commitment = getCommitment(commitmentId);
  commitment
    ? res.send(commitment)
    : res
        .status(STATUS_CODE_NOT_FOUND)
        .send(`No match found for commitment id: ${commitmentId}`);
});

// Stop a commitment by commitment id
app.post('/commitment/:commitmentId', async (req, res) => {
  log('POST/commitment', req.prams.commitmentId);
  let { commitmentId } = req.params;
  const commitment = getCommitment(commitmentId);

  if (commitment) {
    if (commitment.status === STATUS_STOPPED) {
      res
        .status(STATUS_CODE_BAD_REQUEST)
        .send('Specified commitment has already been stopped.');
      return;
    }
    commitment.status = STATUS_STOPPED;
    res.send(commitment);
  } else {
    res
      .status(STATUS_CODE_NOT_FOUND)
      .send(`No match found for commitment id: ${commitmentId}`);
  }
});

// Refund a commitment by commitment id
app.post('/commitment/refund/:commitmentId', async (req, res) => {
  log('POST/commitment', req.prams.commitmentId);
  let { commitmentId } = req.params;
  const commitment = getCommitment(commitmentId);

  if (commitment) {
    if (commitment.status === STATUS_STOPPED) {
      res
        .status(STATUS_CODE_BAD_REQUEST)
        .send('Specified commitment has already been refunded.');
      return;
    }
    commitment.status = STATUS_REFUNDED;
    res.send(commitment);
  } else {
    res
      .status(STATUS_CODE_NOT_FOUND)
      .send(`No match found for commitment id: ${commitmentId}`);
  }
});

app.get('/transaction/:transactionId', async (req, res) => {
  log('GET/transaction', req.params.transactionId);
  let { transactionId } = req.params;
  const transaction = getTransaction(transactionId);
  transaction
    ? res.send(transaction)
    : res
        .status(STATUS_CODE_NOT_FOUND)
        .send(`No match found for transaction id: ${transactionId}`);
});

const isDataFileValid = () => {
  try {
    fs.readFileSync(COMMITMENTS_DATA_FILE);
    fs.readFileSync(TRANSACTIONS_DATA_FILE);
  } catch (e) {
    console.error(e.message);
    return false;
  }
  return true;
};

if (!isDataFileValid()) {
  log(`Invalid data, generating a new set...`);
  const [commitments, transactions] = generate.generateData(100);
  fs.writeFileSync(COMMITMENTS_DATA_FILE, JSON.stringify(commitments));
  fs.writeFileSync(TRANSACTIONS_DATA_FILE, JSON.stringify(transactions));
}

app.listen(PORT, () => {
  log(`Listening on port ${PORT}`);
});
