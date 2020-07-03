// taken from SPC graphql data model for rendering a recurring commitments table
module.exports.EXAMPLE_COMMITMENT = {
  organizationId: 12363,
  id: '21d79074-f01c-40cd-a74e-93fa758e5568', // Origin ID
  creationTimestamp: '',
  startedTimestamp: '',
  firstName: 'Benjamin',
  lastName: 'Brown',
  email: 'benjamin.t.brown@hotmail.com',
  amountPaidToDate: 1000,
  pledgeAmount: null,
  currency: 'USD',
  status: 'ACTIVE',
  paymentMethod: {
    origin: 'Giving Page',
    originName: "Benjamin's QA3 Giving Page",
    paymentGateway: 'SFDO Test',
    paymentGatewayNickname: 'ben',
    card: 'VISA',
    lastFour: '1111',
    expiration: '01/2021',
  },
  schedules: [
    {
      id: '5dc7236e-9b2a-4d5b-92c1-c59b86120b06', // Recurring ID
      nextPaymentTimestamp: '2020-07-04T09:35:00Z',
      recurringAmount: 1000,
      frequency: 'MONTH',
      status: 'ACTIVE', // Succeeded?
    },
  ],
  installments: [
    {
      date: '2020-07-04T09:35:00Z',
      status: 'SUCCEEDED',
      amount: 10,
      currency: 'USD',
    },
  ],
  customFields: {
    blarg: 'honk',
  },
};

module.exports.EXAMPLE_TRANSACTION = {
  id: '678e9bfc-9c6f-41ff-9ecf-16cf22f9a2b5',
  firstName: 'Archana',
  metadata: {
    originType: 'GIVING_PAGE',
    originId: '882f9503-9e34-4673-becd-780f5cf3a532',
    originDisplayName: 'Bilbo',
  },
  lastName: 'Sasi',
  type: 'PAYMENT',
  originalTransactionId: '678e9bfc-9c6f-41ff-9ecf-16cf22f9a2b5',
  commitmentId: null,
  gatewayId: '0e02ad6b-900f-43ab-96ce-55ce5de513d9',
  email: 'asasi+0528_1_qa1@salesforce.com',
  amount: 2500,
  amountRefunded: 0,
  currencyCode: 'USD',
  status: 'CAPTURED',
  paymentType: 'CARD',
  mostRecentReceiptId: '3da06aa2-7244-4850-bed5-f7426c448a3b',
  timestamp: '2020-06-26T22:07:30.832911Z',
  createdAt: '2020-06-26T22:07:30.832911Z',
  authorizedAt: '2020-06-26T22:07:31.258893Z',
  cardData: {
    last4: '1111',
    brand: 'visa',
    expirationYear: '2023',
    expirationMonth: '04',
  },
};
