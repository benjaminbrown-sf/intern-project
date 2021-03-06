import React from 'react';
import moment from 'moment';

import theme from 'theme';

import { fixCasing } from 'utils';

import {
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
} from '@material-ui/core';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import CheckCircleOutlineIcon from '@material-ui/icons/CheckCircleOutline';
import DateRangeIcon from '@material-ui/icons/DateRange';

import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(theme => {
  return {
    paymentsTable: {
      maxWidth: '700px',
    },
    checkCircle: {
      color: theme.palette.success.main,
      marginRight: '5px',
    },
    recurringContainer: {
      width: '55%',
    },
    iconContainer: {
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      marginTop: '5px',
      height: '25px',
      marginBottom: '5px',
    },
    actionIcon: {
      marginTop: '5px',
    },
    title: {
      textAlign: 'left',
      marginBottom: '5px',
    },
    calendarIcon: {
      marginRight: '7.5px',
    },
    textBold: {
      fontWeight: 'bold',
    },
    alignRow: {
      alignItems: 'center',
    },
  };
});

export interface Installment {
  date: string;
  status: string;
  amount: number;
  currency: string;
}

export interface RecurringPaymentProps {
  installments: Installment[];
  nextPayment: string;
  recurringAmount: number;
  currency: string;
}

const RecurringPayments = (props: RecurringPaymentProps): JSX.Element => {
  const classes = useStyles(theme);
  const { installments, nextPayment, recurringAmount, currency } = props;

  const tableHeaders = [
    { label: 'Date', value: 'DATE' },
    { label: 'Status', value: 'STATUS' },
    { label: 'Amount', value: 'AMOUNT' },
    { label: 'Actions', value: 'ACTIONS' },
  ];

  return (
    <div className={classes.recurringContainer}>
      <h3 className={classes.title}>Recurring Payments</h3>
      <div className={classes.iconContainer}>
        <DateRangeIcon className={classes.calendarIcon} />
        <p>{`Next payment is on ${moment(nextPayment).format('L')} for $${
          recurringAmount / 1000
        } ${currency}`}</p>
      </div>
      <Table className={classes.paymentsTable}>
        <TableHead>
          <TableRow>
            {tableHeaders.map(header => {
              return (
                <TableCell
                  className={classes.textBold}
                  key={`TableHeader-${header.value}`}
                >
                  {header.label}
                </TableCell>
              );
            })}
          </TableRow>
        </TableHead>
        <TableBody>
          {installments.map((installment, i) => {
            return (
              <TableRow
                className={classes.alignRow}
                key={`RecurringPayment-${i}-row`}
              >
                <TableCell key={`RecurringPayment-${i}-date`}>
                  {moment(installment.date).format('L')}
                </TableCell>
                <TableCell key={`RecurringPayment-${i}-status`}>
                  <div className={classes.iconContainer}>
                    {installment.status === 'ACTIVE' ? (
                      <CheckCircleOutlineIcon className={classes.checkCircle} />
                    ) : null}
                    <div>{fixCasing(installment.status)}</div>
                  </div>
                </TableCell>
                <TableCell key={`RecurringPayment-${i}-amount`}>
                  ${installment.amount / 1000} {installment.currency}
                </TableCell>
                <TableCell key={`RecurringPayment-${i}-action`}>
                  <MoreVertIcon className={classes.actionIcon} />
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
      <h3 className={classes.title}>Custom Fields</h3>
    </div>
  );
};

export default RecurringPayments;
