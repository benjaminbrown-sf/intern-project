import React from 'react';
import moment from 'moment';

import theme from '../theme';

import {
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
} from '@material-ui/core';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import CheckCircleOutlineIcon from '@material-ui/icons/CheckCircleOutline';

import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(theme => {
  return {
    paymentsTable: {
      maxWidth: '700px',
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
}

const RecurringPayments = (props: RecurringPaymentProps) => {
  const classes = useStyles(theme);
  const { installments } = props;

  const tableHeaders = [
    { label: 'Date', value: 'DATE' },
    { label: 'Status', value: 'STATUS' },
    { label: 'Amount', value: 'AMOUNT' },
    { label: 'Actions', value: 'ACTIONS' },
  ];

  const fixCasing = (str: string) => {
    return (
      str.toLowerCase().charAt(0).toUpperCase() + str.toLowerCase().slice(1)
    );
  };

  let i = 0;

  return (
    <Table className={classes.paymentsTable}>
      <TableHead>
        <TableRow>
          {tableHeaders.map(header => {
            return (
              <TableCell key={`TableHeader-${header.value}+`}>
                {header.label}
              </TableCell>
            );
          })}
        </TableRow>
      </TableHead>
      <TableBody>
        {installments.map(installment => {
          return (
            <TableRow key={`RecurringPayment-${++i}-row`}>
              <TableCell key={`RecurringPayment-${i}-date`}>
                {moment(installment.date).format('L')}
              </TableCell>
              <TableCell key={`RecurringPayment-${i}-status`}>
                <div>
                  {installment.status === 'ACTIVE' ? (
                    <CheckCircleOutlineIcon />
                  ) : null}
                </div>
                <div>{fixCasing(installment.status)}</div>
              </TableCell>
              <TableCell key={`RecurringPayment-${i}-amount`}>
                {installment.amount}
                {installment.currency}
              </TableCell>
              <TableCell key={`RecurringPayment-${i}-action`}>
                <MoreVertIcon />
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
};

export default RecurringPayments;
