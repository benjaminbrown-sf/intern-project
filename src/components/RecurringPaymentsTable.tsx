import React, { useState, useCallback } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
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
  const [filterVariables, setFilterVariables] = React.useState(['']);

  const queryParams: CommitmentsQueryParams = {
    limit: 10,
    page: 0,
    sortField: sortVariable,
    sortDirection,
    statuses: filterVariables.join(','),
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
      value: 'status',
    },
  ];

  const filters = [
    {
      label: 'Active',
      value: 'ACTIVE',
    },
    {
      label: 'Canceled',
      value: 'CANCELED',
    },
    {
      label: 'Stopped',
      value: 'STOPPED',
    },
  ];

  return (
    <TableContainer component={Paper}>
      {filters.map(filter => {
        return (
          <Chip
            label={filter.label}
            onClick={() => {
              // May be a problem, as filterVariables will never again contain ''
              let newFilters = [...filterVariables].filter(
                index => index != ''
              );
              if (newFilters.includes(filter.value)) {
                const index = newFilters.indexOf(filter.value);
                newFilters.splice(index, 1);
              } else {
                newFilters.push(filter.value);
              }
              console.log(newFilters);
              setFilterVariables(newFilters);
            }}
          ></Chip>
        );
      })}
      <Table>
        <TableHead>
          <TableRow>
            {columns.map(obj => {
              return (
                <TableCell
                  className={classes.tableCellHeader}
                  onClick={() => {
                    if (obj.value === sortVariable) {
                      setSortDirection(sortDirection === 'ASC' ? 'DSC' : 'ASC');
                    }
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
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default RecurringPaymentsTable;
