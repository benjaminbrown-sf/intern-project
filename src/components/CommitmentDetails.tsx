import React from 'react';

import { useGet, CommitmentsQueryParams } from '../hooks/axiosHooks';

import fixCasing from '../utils/fixCasing';

import theme from '../theme';

import {
  createMuiTheme,
  ThemeProvider,
  makeStyles,
} from '@material-ui/core/styles';
import { Divider, Button } from '@material-ui/core';
import CheckCircleOutlineIcon from '@material-ui/icons/CheckCircleOutline';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import PaymentIcon from '@material-ui/icons/Payment';

import PaymentDetails from './PaymentDetails';
import RecurringPayments from './RecurringPayments';

const MUITheme = createMuiTheme(theme);

export interface DetailProps {
  displayId: string;
  setDisplayId: (displayId: string) => void;
}

const useStyles = makeStyles(theme => {
  return {
    errorText: {
      color: theme.palette.error.main,
    },
    flexRow: {
      display: 'flex',
      flexDirection: 'row',
    },
    pageTitle: {
      textAlign: 'left',
    },
    iconContainer: {
      display: 'flex',
      alignItems: 'center',
    },
    paymentContainer: {
      display: 'flex',
      flexDirection: 'row',
      maxWidth: '400px',
      minWidth: '35%',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '25px',
    },
    userContainer: {
      display: 'flex',
      flexDirection: 'row',
      maxWidth: '50%',
      minWidth: '500px',
      textAlign: 'left',
      marginBottom: '20px',
      alignItems: 'center',
    },
    infoContainer: {
      display: 'flex',
      flexDirection: 'column',
    },
    cardContainer: {
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'space-between',
      minWidth: '185px',
      marginLeft: '13px',
      marginBottom: '17px',
    },
    textBold: {
      fontWeight: 'bold',
    },
    textLight: {
      fontWeight: 'lighter',
    },
    checkCircle: {
      color: '#14FF52',
      fontSize: 'medium',
      marginRight: '5px',
    },
    accountIcon: {
      fontSize: 'medium',
      marginBottom: '18px',
      marginRight: '6px',
    },
    paymentIcon: {
      fontSize: 'medium',
    },

    titleContainer: {
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    cancelButton: {
      height: '50%',
    },
  };
});

const CommitmentDetails = (props: DetailProps): JSX.Element => {
  const classes = useStyles(theme);
  const { displayId, setDisplayId } = props;

  const queryParams: CommitmentsQueryParams = {
    limit: 1,
    page: 0,
  };

  const [response, loading, error] = useGet(
    `commitment/${displayId}`,
    queryParams
  );

  if (loading) {
    console.log('loading');
    return <div></div>;
  }
  const data = response && response.data; // same response?.data

  if (!data) {
    return <div></div>;
  }

  console.log(JSON.stringify(response?.data));

  const {
    id,
    creationTimestamp,
    startedTimestamp,
    firstName,
    lastName,
    email,
    amountPaidToDate,
    currency,
    status,
    paymentMethod,
    schedules,
    installments,
  } = data;

  const { frequency, recurringAmount, nextPaymentTimestamp } = schedules[0];

  const {
    origin,
    originName,
    paymentGateway,
    paymentGatewayNickname,
    card,
    lastFour,
    expiration,
  } = paymentMethod;

  const paymentDetails = {
    origin,
    originName,
    id,
    paymentGateway,
    paymentGatewayNickname,
    creationTimestamp,
    startedTimestamp,
    recurringId: schedules[0].id,
  };

  return (
    <div>
      {error ? (
        <p className={classes.errorText}>
          There was an error making the request.
        </p>
      ) : null}

      {loading ? (
        <p>Loading...</p>
      ) : (
        <ThemeProvider theme={MUITheme}>
          <div
            onClick={() => {
              setDisplayId('');
              window.location.hash = '';
            }}
          >
            <div className={classes.titleContainer}>
              <h2 className={classes.pageTitle}>Recurring Payment</h2>
              <Button
                className={classes.cancelButton}
                variant="contained"
                color="primary"
                size="medium"
              >
                {fixCasing('Cancel Recurring Donation')}
              </Button>
            </div>
            <div className={classes.paymentContainer}>
              <div
                className={classes.textBold}
              >{`$${amountPaidToDate} ${currency} Total`}</div>
              <div className={classes.textBold}>{`$${
                recurringAmount / 1000
              } ${currency} Per ${fixCasing(frequency)}`}</div>
              {status === 'ACTIVE' ? (
                <div className={classes.iconContainer}>
                  <CheckCircleOutlineIcon className={classes.checkCircle} />
                  <div>{fixCasing(status)}</div>
                </div>
              ) : (
                <div className={classes.iconContainer}>
                  <CheckCircleOutlineIcon className={classes.checkCircle} />
                  <div>{fixCasing(status)}</div>
                </div>
              )}
            </div>
            <div className={classes.userContainer}>
              <AccountCircleIcon className={classes.accountIcon} />
              <div className={classes.infoContainer}>
                <div className={classes.textBold}>
                  {`${firstName} ${lastName}`}
                </div>
                <div className={classes.textLight}>{email}</div>
              </div>
              <div className={classes.cardContainer}>
                <PaymentIcon className={classes.paymentIcon} />
                <div className={classes.textBold}>{`${fixCasing(
                  card
                )}, *${Math.floor(lastFour)}`}</div>
                <div className={classes.textLight}>{`Exp. ${expiration}`}</div>
              </div>
            </div>
          </div>
          <Divider />
          <div className={classes.flexRow}>
            <PaymentDetails info={paymentDetails} />
            <RecurringPayments
              nextPayment={nextPaymentTimestamp}
              installments={installments}
              recurringAmount={recurringAmount}
              currency={currency}
            />
          </div>
        </ThemeProvider>
      )}
    </div>
  );
};

export default CommitmentDetails;
