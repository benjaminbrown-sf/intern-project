import React from 'react';
import moment from 'moment';
import { fixCasing } from 'utils';
import { TableRow, TableCell } from '@material-ui/core';
import CheckCircleOutlineIcon from '@material-ui/icons/CheckCircleOutline';
import { makeStyles } from '@material-ui/core/styles';
import theme from '../theme';
import { CommitmentResponse } from '../hooks/axiosHooks';
import HighlightOffIcon from '@material-ui/icons/HighlightOff';


const useStyles = makeStyles(theme => {
  return {
    flexCell: {
      display: 'flex',
      flexDirection: 'column',
    },
    checkCircle: {
      color: theme.palette.success.main,
      fontSize: 'medium',
      marginRight: '5px',
    },
    alignCell: {
      display: 'flex',
      alignItems: 'center',
    },
    hiddenText: {
      visibility: 'hidden',
    },
    crossCircle: {
      color: theme.palette.error.main,
      fontSize: 'medium',
      marginRight: '5px',
    },
  };
});

// This means that props is expecting a single argument, commitment, of imported type Commitment
export interface RowProps {
  commitment: CommitmentResponse;
  changeHash: (newHash: string) => void;
}

const RecurringPaymentsTableRow = (props: RowProps): JSX.Element => {
  const classes = useStyles(theme);

  const { changeHash } = props;
  const schedules = props.commitment.schedules[0];
  const { id, status } = props.commitment;

  const timestamp = schedules.nextPaymentTimestamp;
  const date = moment(timestamp).format('L');

  const name = props.commitment.firstName + ' ' + props.commitment.lastName;

  const totalGiving = `$${props.commitment.amountPaidToDate / 1000} ${
    props.commitment.currency
  }`;

  const nextPayment = `$${schedules.recurringAmount / 1000} ${
    props.commitment.currency
  } / ${schedules.frequency}`;

  return (
    <TableRow
      onClick={() => {
        changeHash('' + id);
      }}
    >
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
          ) : (
            <HighlightOffIcon className={classes.crossCircle} />
          )}
          {fixCasing(status)}
        </div>
        <div className={classes.hiddenText}>Ghost Text</div>
      </TableCell>
    </TableRow>
  );
};

export default RecurringPaymentsTableRow;
