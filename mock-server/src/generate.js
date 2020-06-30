const EXAMPLE = require('./example');
const faker = require('faker');
const {
  STATUS_ACTIVE,
  STATUS_CANCELED,
  STATUS_STOPPED,
} = require('./constants');

const randomId = () => {
  const set = 'abcdefghijklmnopqrstuvwxyz1234567890';
  let ret = '';
  for (let i = 0; i < 10; i++) {
    ret += set[Math.floor(Math.random() * set.length)];
  }
  return ret;
};

const generateTransaction = ({
  firstName,
  lastName,
  email,
  commitmentId,
  transactionDate,
  amount,
}) => {
  const status = 'CAPTURED';
  const card = 'VISA';
  const lastFour = String(1000 + Math.floor(Math.random() * 9000));
  const expirationYear = '2023';
  const expirationMonth = '04';

  return {
    ...EXAMPLE.EXAMPLE_TRANSACTION,
    id: randomId(),
    metadata: {
      originType: 'GIVING_PAGE',
      originId: '882f9503-9e34-4673-becd-780f5cf3a532',
      originDisplayName: 'Giving Page',
    },
    status,
    firstName,
    lastName,
    email,
    commitmentId,
    amount,
    timestamp: transactionDate,
    createdAt: transactionDate,
    authorizedAt: transactionDate,
    cardData: {
      last4: lastFour,
      brand: card,
      expirationYear,
      expirationMonth,
    },
  };
};

const generateInstallment = ({
  firstName,
  lastName,
  email,
  commitmentId,
  transactionDate,
  amount,
}) => {
  const status = STATUS_ACTIVE;
  const currency = 'USD';

  const transaction = generateTransaction({
    firstName,
    lastName,
    email,
    commitmentId,
    transactionDate,
    amount,
  });

  return [
    {
      transactionId: transaction.id,
      date: transactionDate,
      status,
      amount,
      currency,
    },
    transaction,
  ];
};

const generatePaymentMethod = () => {
  const origin = faker.finance.account();
  const originName = faker.finance.accountName();
  const paymentGateway = 'SFDO Test';
  const paymentGatewayNickname = 'SFDO';
  const card = 'VISA';
  const lastFour = String(1000 + Math.floor(Math.random() * 9000));
  const expiration = '01/21';
  return {
    origin,
    originName,
    paymentGateway,
    paymentGatewayNickname,
    card,
    lastFour,
    expiration,
  };
};

const generateCommitment = () => {
  const transactions = [];
  const installments = [];

  const commitmentId = randomId();
  const nextPayment = new Date();
  nextPayment.setDate(nextPayment.getDate() + 30);
  const status =
    Math.random() > 0.15
      ? STATUS_ACTIVE
      : Math.random() > 0.5
      ? STATUS_CANCELED
      : STATUS_STOPPED;
  const amount = 1000 + Math.floor(Math.random() * 250) * 1000;

  const nMonthsAgo = Math.floor(1 + Math.random() * 10);
  const creationTimestamp = faker.date.recent(nMonthsAgo * 30);
  const startedTimestamp = faker.date.recent(nMonthsAgo * 30);

  const firstName = faker.name.firstName();
  const lastName = faker.name.lastName();
  const email = `${firstName}.${lastName}@${faker.internet.domainWord()}.${faker.internet.domainSuffix()}`;

  for (let i = 0; i < nMonthsAgo; i++) {
    const transactionDate = new Date();
    transactionDate.setDate(nextPayment.getDate() - i * 30);
    const [installment, transaction] = generateInstallment({
      firstName,
      lastName,
      email,
      commitmentId,
      transactionDate,
      amount,
    });
    installments.push(installment);
    transactions.push(transaction);
  }

  const paymentMethod = generatePaymentMethod();
  const customFields = {};
  for (let i = 0; i < 10; i++) {
    if (Math.random() < 0.5) {
      break;
    }
    customFields[faker.finance.accountName()] = faker.finance.bitcoinAddress();
  }

  const commitment = {
    ...EXAMPLE.EXAMPLE_COMMITMENT,
    id: commitmentId,
    creationTimestamp,
    startedTimestamp,
    firstName,
    lastName,
    email,
    amountPaidToDate: amount * nMonthsAgo,
    status: status,
    paymentMethod,
    schedules: [
      {
        ...EXAMPLE.EXAMPLE_COMMITMENT.schedules[0],
        id: randomId(),
        recurringAmount: amount,
        nextPaymentTimestamp: +nextPayment,
        status,
      },
    ],
    installments,
    customFields,
  };
  return [commitment, transactions];
};

const generateData = amount => {
  const commitments = [];
  let transactions = [];
  for (let i = 0; i < amount; i++) {
    const [commitment, newTransactions] = generateCommitment();
    commitments.push(commitment);
    transactions = transactions.concat(newTransactions);
  }
  return [commitments, transactions];
};

module.exports.generateData = generateData;
