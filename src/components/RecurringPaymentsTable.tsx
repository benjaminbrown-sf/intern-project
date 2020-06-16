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

import OutlinedInput from '@material-ui/core/OutlinedInput';
import FilterListIcon from '@material-ui/icons/FilterList';
import SearchIcon from '@material-ui/icons/Search';

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
    filterIcon: {
      fontSize: 'medium',
    },
    filterContainer: {
      display: 'flex',
      alignItems: 'center',
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    filters: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      width: '20%', // Especially not married to this
    },
    searchBar: {
      justifyContent: 'right',
      borderRadius: theme.shape.borderRadius,
    },
    searchIcon: {
      position: 'absolute',
      marginTop: '15px',
    },
    emptySpace: {
      visibility: 'hidden',
    },
    searchIconContainer: {
      display: 'flex',
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
      <div className={classes.filterContainer}>
        <div className={classes.filters}>
          <FilterListIcon className={classes.filterIcon} />
          Filter
          {filters.map(obj => {
            return (
              <Chip
                variant={
                  filterVariables.includes(obj.value) ? 'outlined' : 'default'
                }
                clickable={true}
                label={obj.label}
                onClick={() => {
                  // May be a problem, as filterVariables will never again contain ''
                  let newFilters = [...filterVariables].filter(
                    index => index != ''
                  );
                  if (newFilters.includes(obj.value)) {
                    const index = newFilters.indexOf(obj.value);
                    newFilters.splice(index, 1);
                  } else {
                    newFilters.push(obj.value);
                  }
                  setFilterVariables(newFilters);
                }}
              ></Chip>
            );
          })}
        </div>
        <div className={classes.emptySpace}>Empty Space</div>
        <div>
          <div className={classes.searchIconContainer}>
            <SearchIcon className={classes.searchIcon} />
          </div>
          <OutlinedInput placeholder="Search"></OutlinedInput>
        </div>
      </div>
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
