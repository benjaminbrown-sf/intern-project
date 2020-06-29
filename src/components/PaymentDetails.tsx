import React from 'react';
import moment from 'moment';

import {
  makeStyles,
  createMuiTheme,
  ThemeProvider,
} from '@material-ui/core/styles';

import theme from '../theme';

const MUITheme = createMuiTheme(theme);

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
    // paymentContainer: {

    // }
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

  return (
    <ThemeProvider theme={MUITheme}>
      <div>
        <h5>Payment Details</h5>
        <div className={classes.cellContainer}>
          <div>Origin</div>
          <div>{origin}</div>
        </div>
        <div className={classes.cellContainer}>
          <div>Origin Name</div>
          <div>{originName}</div>
        </div>
        <div className={classes.cellContainer}>
          <div>Origin ID</div>
          <div>{id}</div>
        </div>
        <div className={classes.cellContainer}>
          <div>Payment Gateway</div>
          <div>{paymentGateway}</div>
        </div>
        <div className={classes.cellContainer}>
          <div>Payment Gateway Nickname</div>
          <div>{paymentGatewayNickname}</div>
        </div>
        <div className={classes.cellContainer}>
          <div>Created</div>
          <div>{moment(creationTimestamp).format('L')}</div>
        </div>
        <div className={classes.cellContainer}>
          <div>Started</div>
          <div>{moment(startedTimestamp).format('L')}</div>
        </div>
        <div className={classes.cellContainer}>
          <div>Recurring ID</div>
          <div>{recurringId}</div>
        </div>
      </div>
    </ThemeProvider>
  );
};

export default PaymentDetails;
