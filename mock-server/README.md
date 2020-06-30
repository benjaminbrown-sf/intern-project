## Mock Server

This is a mock server intended for development of this project.  To run the server, type

`yarn && yarn start`

It contains two endpoints:

`commitments` and `generate`

To randomly create a set of 100 commitments, run the server, then paste this into a browser tab:

`GET localhost:9998/generate`

This will return the JSON list for all 100 commitments and save a file called `commitments.json`.  The server reads this file as its source of data.

To query these commitments, use the `commitments` endpoint:

`GET localhost:9998/commitments`

Pasting the above into a browser tab will list all the commitments in the commitments.json file.

A single commitment has this data structure:

```
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
    }
```

*NOTE* amountPaidToDate and recurringAmount are listed in cents
*NOTE* all the mock server's commitments are MONTH frequency

To retrieve data for a single commitment:

`GET localhost:9998/commitment/<commitmentId>`

To stop a commitment:

`POST localhost:9998/commitment/<commitmentId>`

To refund a commitment:

`POST localhost:9998/commitment/refund/<commitmentId>`

## Argument Examples

- sortField: the key in the commitment to sort the output.  One of [id, firstName, lastName, email, amountPaidToDate, currency, status].
- sortDirection: the direction to sort the sortField.  One of ['ASC', 'DSC'].  Default='ASC'.

Examples: 
  // sort by firstName ASC
  localhost:9998/commitments?sortField=firstName
  // sort by lastName DSC
  localhost:9998/commitments?sortField=lastName&sortDirection=DSC

- limit: the maximum number of entries to return.  Any number >= 0
- page: when limit is specified, the offset of entries to return.

Examples: 
  // first 12 entries sorted by firstName: 
  localhost:9998/commitments?sortField=firstName&limit=12
  // entries 24 - 36 sorted by firstName
  localhost:9998/commitments?sortField=firstName&limit=12&page=2

- statuses: filter the results by a list of statuses.  List of ['ACTIVE', 'CANCELED', 'STOPPED']

Examples: 
  // all active commitments
  localhost:9998/commitments?statuses=ACTIVE
  // all stopped or canceled commitments
  localhost:9998/commitments?statuses=STOPPED,CANCELED
  // max five, page two, stopped or cancelled commitments sorted by email descending
  localhost:9998/commitments?statuses=STOPPED,CANCELED&sortField=email&sortDirection=DSC&limit=5&page=2

- search: string of characters to search firstName, lastName, or email

Examples:
  // all entries with firstName, lastName, or email with letters 'cl'
  http://localhost:9998/commitments?search=cl