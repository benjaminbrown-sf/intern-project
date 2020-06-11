import React from 'react';
import moment from 'moment';

import { TableRow, TableCell } from '@material-ui/core';
import CheckCircleOutlineIcon from '@material-ui/icons/CheckCircleOutline';
// import { CheckCircleOutlineIcon } from '@material-ui/icons';
import { makeStyles } from '@material-ui/core/styles';
import theme from '../theme'; // Double-check this; styling should be done on top level?

import { Commitment } from './RecurringPaymentsTable';

const useStyles = makeStyles(theme => {
  return {
    flexCell: {
      display: 'flex',
      flexDirection: 'column',
    },
    checkCircle: {
      color: '#14FF52',
    },
  };
});

// This means that props is expecting a single argument, commitment, of imported type Commitment
export interface RowProps {
  commitment: Commitment;
}

const RecurringPaymentsTableRow = (props: RowProps): JSX.Element => {
  const classes = useStyles();

  // Handles Date Formatting
  let timestamp = props.commitment.schedules[0].nextPaymentTimestamp;
  let date = moment(timestamp).format('L');

  let name = props.commitment.firstName + ' ' + props.commitment.lastName;

  let totalGiving = `$${props.commitment.amountPaidToDate / 100} ${
    props.commitment.currency
  }`;

  let nextPayment = `$${props.commitment.schedules[0].recurringAmount} ${props.commitment.currency} / ${props.commitment.schedules[0].frequency}`;

  let status = props.commitment.schedules[0].status;

  return (
    <TableRow>
      <TableCell className={classes.flexCell} align="left">
        <div>{name}</div>
        <div>{props.commitment.email}</div>
      </TableCell>
      <TableCell align="left">{totalGiving}</TableCell>
      <TableCell className={classes.flexCell} align="left">
        <div>{date}</div>
        <div>{nextPayment}</div>
      </TableCell>
      <TableCell align="left">
        {status === 'ACTIVE' ? (
          <CheckCircleOutlineIcon className={classes.checkCircle} />
        ) : null}
        {status}
      </TableCell>
    </TableRow>
  );
};

export default RecurringPaymentsTableRow;
