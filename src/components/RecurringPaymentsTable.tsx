import React, { useState, useCallback } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from '@material-ui/core';
import theme from '../theme';

import { useGet, CommitmentsQueryParams } from '../hooks/axiosHooks';

import { makeStyles } from '@material-ui/core/styles';

import RecurringPaymentsTableRow from './RecurringPaymentsTableRow';

const useStyles = makeStyles(theme => {
  return {
    columnHeader: {
      fontWeight: 'bold',
      color: '#21007F',
    },
    tableCellHeader: {
      cursor: 'pointer',
      '&:hover': {
        filter: 'brightness(120%)',
        userSelect: 'none',
      },
    },
    errorText: {
      color: theme.palette.error.main,
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

const RecurringPaymentsTable = (): JSX.Element => {
  const classes = useStyles();

  const [sortDirection, setSortDirection] = React.useState('ASC');
  const [sortVariable, setSortVariable] = React.useState('firstName');
  const [sortColumn, setSortColumn] = React.useState('firstName');

  const queryParams: CommitmentsQueryParams = {
    limit: 10,
    page: 0,
    sortField: sortVariable,
    sortDirection,
  };

  const [response, loading, error] = useGet('commitments', queryParams);

  const columns = [
    {
      label: 'Donor',
      value: 'firstName',
    },
    {
      label: 'Total Giving',
      value: 'amountPaidToDate',
    },
    {
      label: 'Next Installment',
      value: 'amountPaidToDate',
    },
    {
      label: 'Status',
      value: 'amountPaidToDate',
    },
  ];

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            {columns.map(obj => {
              return (
                <TableCell
                  className={classes.tableCellHeader}
                  onClick={() => {
                    if (sortColumn === obj.value) {
                      setSortDirection(sortDirection === 'ASC' ? 'DSC' : 'ASC');
                    }
                    setSortColumn(obj.value);
                    setSortVariable(obj.value);
                  }}
                >
                  {obj.label}
                </TableCell>
              );
            })}
          </TableRow>
        </TableHead>
        <TableBody>
          <div>
            {loading ? <p> Loading...</p> : null}
            {error ? (
              <p className={classes.errorText}>
                There was an error making the request.
              </p>
            ) : null}
          </div>
          {response
            ? response.data.commitments.map(commitment => (
                <RecurringPaymentsTableRow commitment={commitment} />
              ))
            : null}
          {}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default RecurringPaymentsTable;
