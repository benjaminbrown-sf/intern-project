import React from 'react';
import theme from './theme';

const RecurringPaymentsTableRow = (commitment): JSX.Element => {
  const [firstName, lastName, email, amountPaidToDate, schedules] = commitment;

  return (
    <div>
      <div label="donor">
        <div>{firstName + ' ' + lastName}</div>
        <br />
        <div>{email}</div>
      </div>
      <div label="totalGiving">{amountPaidToDate}</div>
      <div label="nextInstallment">
        <div>{schedules.nextPaymentTimestamp}</div>
        <div>{schedules.recurringAmount}</div>
      </div>
      <div label="status">{schedules.status}</div>
    </div>
  );
};

export default RecurringPaymentsTableRow;
