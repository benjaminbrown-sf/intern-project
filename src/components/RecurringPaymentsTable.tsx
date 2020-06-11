import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from '@material-ui/core';

// Import Axios Hook?

import { makeStyles } from '@material-ui/core/styles';

import RecurringPaymentsTableRow from './RecurringPaymentsTableRow';

const useStyles = makeStyles(() => {
  return {
    columnHeader: {
      fontWeight: 'bold',
      color: '#21007F',
    },
  };
});

export interface Pagination {
  totalCount: number;
  pageStart?: number;
  pageEnd?: number;
}

export interface Schedule {
  id: string;
  nextPaymentTimestamp: string;
  recurringAmount: number;
  frequency: string;
  status: string;
}

export interface Commitment {
  organizationId: number;
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  amountPaidToDate: number;
  pledgeAmount?: number;
  currency: string;
  status: string;
  schedules: Schedule[];
}

export interface TableProps {
  response: {
    pagination: Pagination;
    commitments: Commitment[];
  };
}

const RecurringPaymentsTable = (props: TableProps): JSX.Element => {
  const classes = useStyles();

  const commitments = props.response.commitments;

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell className={classes.columnHeader}>Donor</TableCell>
            <TableCell className={classes.columnHeader}>Total Giving</TableCell>
            <TableCell className={classes.columnHeader}>
              Next Installment
            </TableCell>
            <TableCell className={classes.columnHeader}>Status</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {commitments.map(commitment => (
            <RecurringPaymentsTableRow commitment={commitment} />
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default RecurringPaymentsTable;
