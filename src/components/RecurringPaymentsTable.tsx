import React, { useEffect } from 'react';
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

import TextInput from '../elements/TextInput';
import FilterListIcon from '@material-ui/icons/FilterList';

import theme from '../theme';

import { useGet, CommitmentsQueryParams } from '../hooks/axiosHooks';

import { makeStyles } from '@material-ui/core/styles';

import RecurringPaymentsTableRow from './RecurringPaymentsTableRow';

const useStyles = makeStyles(theme => {
  return {
    columnHeader: {
      fontWeight: 'bold',
      color: theme.palette.primary.main,
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
      width: '350px', // Especially not married to this
    },
    TextInput: {
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

const useDebounce = (value, delay) => {
  const [debouncedValue, setDebouncedValue] = React.useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);
  return debouncedValue;
};

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
  setDisplayId: (displayId: string) => void;
  history: string[];
  setHistory: (history: string[]) => void;
}

const RecurringPaymentsTable = (props: TableProps): JSX.Element => {
  const { setDisplayId, setHistory, history } = props;

  const classes = useStyles(theme);

  const delay = 1000;

  const [sortDirection, setSortDirection] = React.useState('ASC');
  const [sortVariable, setSortVariable] = React.useState('firstName');
  const [filterVariables, setFilterVariables] = React.useState(['']);
  const [searchString, setSearchString] = React.useState('');
  const [inputString, setInputString] = React.useState('');

  const debouncedSearchTerm = useDebounce(searchString, delay);

  const queryParams: CommitmentsQueryParams = {
    limit: 10,
    page: 0,
    sortField: sortVariable,
    sortDirection,
    statuses: filterVariables.join(','),
    search: debouncedSearchTerm,
  };

  // This hook requests data from the mock server.
  // This component will re-render every time the state of this request changes:
  // when it sends the request, when it stops loading, when it has an error,
  // when it has a

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
      value: 'currency',
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
                key={obj.value + 'Chip'} // Where will this matter?
                variant={
                  filterVariables.includes(obj.value) ? 'outlined' : 'default'
                }
                clickable={true}
                label={obj.label}
                onClick={() => {
                  const newFilters = [...filterVariables].filter(
                    index => index !== ''
                  );
                  if (newFilters.includes(obj.value)) {
                    const index = newFilters.indexOf(obj.value);
                    newFilters.splice(index, 1);
                  } else {
                    newFilters.push(obj.value);
                  }
                  setFilterVariables(newFilters);
                }}
              />
            );
          })}
        </div>
        <div className={classes.emptySpace}>Empty Space</div>
        <div>
          <TextInput
            placeholder="Search"
            value={inputString}
            onChange={e => {
              const value = (e as any).target.value;
              setInputString(value);
              setSearchString(value);
            }}
          />
        </div>
      </div>
      <Table>
        <TableHead>
          <TableRow>
            {columns.map(obj => {
              return (
                <TableCell
                  key={obj.value + 'Cell'}
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
          <TableRow>
            {loading ? (
              <TableCell>
                <p> Loading...</p>
              </TableCell>
            ) : null}
            {error ? (
              <p className={classes.errorText}>
                There was an error making the request.
              </p>
            ) : null}
          </TableRow>
          {response
            ? response.data.commitments.map(commitment => (
                <RecurringPaymentsTableRow
                  key={commitment.id}
                  commitment={commitment}
                  setDisplayId={setDisplayId}
                  setHistory={setHistory}
                  history={history}
                />
              ))
            : null}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default RecurringPaymentsTable;
