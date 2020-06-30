import React from 'react';
import moment from 'moment';

import { makeStyles } from '@material-ui/core/styles';

import theme from '../theme';

export interface PaymentDetailInfo {
  origin: number | string;
  originName: string;
  id: number;
  paymentGateway: string;
  paymentGatewayNickname: string;
  creationTimestamp: string;
  startedTimestamp: string;
  recurringId: number;
}

export interface PaymentDetailProps {
  info: PaymentDetailInfo;
}

const useStyles = makeStyles(theme => {
  return {
    cellContainer: {
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    paymentContainer: {
      maxWidth: '50%',
      textAlign: 'left',
      minWidth: '600px',
    },
    detailRow: {
      display: 'flex',
      flexDirection: 'row',
      marginBottom: '5px',
    },
    detailValue: {
      textAlign: 'left',
      marginLeft: '10px',
    },
    detailKey: {
      wordWrap: 'break-word',
      width: '130px',
      alignSelf: 'flex-start',
    },
  };
});

const PaymentDetails = (props: PaymentDetailProps): JSX.Element => {
  const classes = useStyles(theme);

  const {
    origin,
    originName,
    id,
    paymentGateway,
    paymentGatewayNickname,
    creationTimestamp,
    startedTimestamp,
    recurringId,
  } = props.info;

  const ct = moment(creationTimestamp).format('L');
  const st = moment(startedTimestamp).format('L');

  const details = [
    {
      label: 'Origin',
      value: origin,
    },
    {
      label: 'Origin Name',
      value: originName,
    },
    {
      label: 'Origin ID',
      value: id,
    },
    {
      label: 'Payment Gateway',
      value: paymentGateway,
    },
    {
      label: 'Payment Gateway Nickname',
      value: paymentGatewayNickname,
    },
    {
      label: 'Created',
      value: ct,
    },
    {
      label: 'Started',
      value: st,
    },
    {
      label: 'Recurring ID',
      value: recurringId,
    },
  ];

  let i = 0;

  return (
    <div className={classes.paymentContainer}>
      <h3>Payment Details</h3>
      {details.map(item => {
        return (
          <div
            className={classes.detailRow}
            key={`detailValue-${item.label}-${++i}`}
          >
            <div className={classes.detailKey}>{item.label}</div>
            <div className={classes.detailValue}>{item.value}</div>
          </div>
        );
      })}
    </div>
  );
};

export default PaymentDetails;
