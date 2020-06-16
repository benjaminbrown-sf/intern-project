import React from 'react';
import moment from 'moment';

import { TableRow, TableCell } from '@material-ui/core';
import CheckCircleOutlineIcon from '@material-ui/icons/CheckCircleOutline';
import { makeStyles } from '@material-ui/core/styles';
import theme from '../theme'; // Temporary

import { Commitment } from './RecurringPaymentsTable';

const useStyles = makeStyles(theme => {
  return {
    flexCell: {
      display: 'flex',
      flexDirection: 'column',
    },
    checkCircle: {
      color: '#14FF52',
      fontSize: 'small',
    },
    alignCell: {
      display: 'flex',
      alignItems: 'center',
    },
    hiddenText: {
      visibility: 'hidden',
    },
  };
});

// This means that props is expecting a single argument, commitment, of imported type Commitment
export interface RowProps {
  commitment: Commitment;
}

const RecurringPaymentsTableRow = (props: RowProps): JSX.Element => {
  const classes = useStyles();

  const schedules = props.commitment.schedules[0];

  // Handles Date Formatting
  let timestamp = schedules.nextPaymentTimestamp;
  let date = moment(timestamp).format('L');

  let name = props.commitment.firstName + ' ' + props.commitment.lastName;

  let totalGiving = `$${props.commitment.amountPaidToDate / 1000} ${
    props.commitment.currency
  }`;

  let nextPayment = `$${schedules.recurringAmount} ${props.commitment.currency} / ${schedules.frequency}`;

  let status = schedules.status;

  const fixCasing = (str: string) => {
    return (
      str.toLowerCase().charAt(0).toUpperCase() + str.toLowerCase().slice(1)
    );
  };

  return (
    <TableRow>
      <TableCell className={classes.flexCell} align="left">
        <div>{name}</div>
        <div>{props.commitment.email}</div>
      </TableCell>
      <TableCell align="left">
        <div>{totalGiving}</div>
        <div className={classes.hiddenText}>Ghost Text</div>
      </TableCell>
      <TableCell className={classes.flexCell} align="left">
        <div>{date}</div>
        <div>{nextPayment}</div>
      </TableCell>
      <TableCell align="left">
        <div className={classes.alignCell}>
          {status === 'ACTIVE' ? (
            <CheckCircleOutlineIcon className={classes.checkCircle} />
          ) : null}
          {fixCasing(status)}
        </div>
        <div className={classes.hiddenText}>Ghost Text</div>
      </TableCell>
    </TableRow>
  );
};

export default RecurringPaymentsTableRow;
