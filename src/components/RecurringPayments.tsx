import React, { useEffect } from 'react';
import moment from 'moment';

import theme from '../theme';

import fixCasing from '../utils/fixCasing';

import {
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
} from '@material-ui/core';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import CheckCircleOutlineIcon from '@material-ui/icons/CheckCircleOutline';
import HighlightOffIcon from '@material-ui/icons/HighlightOff';
import DateRangeIcon from '@material-ui/icons/DateRange';

import { makeStyles } from '@material-ui/core/styles';

import Menu from '../elements/Menu';
import Button from '../elements/Button';
import axios from 'axios';

const BASE_URL = 'http://localhost:9998';

const useStyles = makeStyles(theme => {
  return {
    paymentsTable: {
      maxWidth: '700px',
    },
    checkCircle: {
      color: theme.palette.success.main,
      marginRight: '5px',
    },
    crossCircle: {
      color: theme.palette.error.main,
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
    actionBox: {
      boxShadow:
        '0px 1px 3px -3px rgba(0,0,0,0.10), 0px 2px 1px 1px rgba(0,0,0,0.08), 0px 1px 1px 2px rgba(0,0,0,0.12)',
    },
  };
});

export interface Installment {
  transactionId: string;
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
  setShouldUpdateData: (shouldUpdateData: boolean) => void;
}

const RecurringPayments = (props: RecurringPaymentProps) => {
  const classes = useStyles(theme);

  const {
    installments,
    nextPayment,
    recurringAmount,
    currency,
    setShouldUpdateData,
  } = props;

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const tableHeaders = [
    { label: 'Date', value: 'DATE' },
    { label: 'Status', value: 'STATUS' },
    { label: 'Amount', value: 'AMOUNT' },
    { label: 'Actions', value: 'ACTIONS' },
  ];

  const refundPayment = async (transactionId: string) => {
    console.log(transactionId);
    try {
      await axios.post(`${BASE_URL}/transaction/refund/${transactionId}`);
      setShouldUpdateData(true);
      return true;
    } catch (error) {
      console.error(error);
      return false;
    }
  };

  const resendReceipt = (transactionId: string) => {
    console.log('What path do you want?');
  };

  const getDetails = async (transactionId: string) => {
    try {
      const response = await axios.get(
        `${BASE_URL}/transaction/${transactionId}`
      );
      const { data } = response;
      console.log(data);
      return data;
    } catch (error) {
      console.error(error);
    }
  };

  const handleDetails = (transactionId: string): any => {
    getDetails(transactionId).then(response => {
      const {
        timestamp,
        status,
        amount,
        currencyCode,
        originalTransactionId,
      } = response;
      return {
        timestamp,
        status,
        amount,
        currencyCode,
        originalTransactionId,
      };
    });
  };

  const payments: any = [];

  const setPayments = () => {
    installments.forEach(el => {
      const {
        timestamp,
        status,
        amount,
        currencyCode,
        originalTransactionId,
      } = handleDetails(el.transactionId);
      payments.push({
        timestamp,
        status,
        amount,
        currencyCode,
        originalTransactionId,
      });
    });
  };

  const actions = [
    { key: 'View Details', func: getDetails },
    { key: 'Refund', func: refundPayment },
    { key: 'Resend Receipt', func: resendReceipt },
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
            console.log(getDetails(installment.transactionId));
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
                    ) : (
                      <HighlightOffIcon className={classes.crossCircle} />
                    )}
                    <div>{fixCasing(installment.status)}</div>
                  </div>
                </TableCell>
                <TableCell key={`RecurringPayment-${i}-amount`}>
                  ${installment.amount / 1000} {installment.currency}
                </TableCell>
                <TableCell key={`RecurringPayment-${i}-action`}>
                  <Button
                    visible={false}
                    type={undefined}
                    onClick={(ev: React.SyntheticEvent) => {
                      setAnchorEl(ev.target as HTMLElement); // Should always be an HTML element
                    }}
                  >
                    <MoreVertIcon className={classes.actionIcon} />
                  </Button>
                </TableCell>
                <Menu
                  anchorEl={anchorEl}
                  open={Boolean(open)}
                  onClose={() => setAnchorEl(null)}
                  setAnchorEl={setAnchorEl}
                  menuItems={actions}
                  transactionId={installment.transactionId}
                ></Menu>
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
