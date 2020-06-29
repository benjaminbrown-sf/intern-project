import React from 'react';

import { useGet, CommitmentsQueryParams } from '../hooks/axiosHooks';

import fixCasing from '../utils/fixCasing';

import theme from '../theme';
import { makeStyles } from '@material-ui/core/styles';
import CheckCircleOutlineIcon from '@material-ui/icons/CheckCircleOutline';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import PaymentIcon from '@material-ui/icons/Payment';

import PaymentDetails from './PaymentDetails';
import RecurringPayments from './RecurringPayments';

// import { Button } from '@material-ui/core';

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
      fontFamily: 'Roboto, Helvetica, Arial, sans-serif,',
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
      alignItem: 'center',
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
    CommitmentDetails: {
      fontFamily: 'inherit',
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

  const { frequency, recurringAmount } = schedules[0];

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
    <div className={classes.CommitmentDetails}>
      {error ? (
        <p className={classes.errorText}>
          There was an error making the request.
        </p>
      ) : null}

      {loading ? (
        <p>Loading...</p>
      ) : (
        <div>
          <div>
            <div className={classes.pageTitle}>
              <h2>Recurring Payments</h2>
            </div>
            <div className={classes.paymentContainer}>
              <div className={classes.textBold}>{`$${
                amountPaidToDate / 1000
              } ${currency} Total`}</div>
              <div
                className={classes.textBold}
              >{`$${recurringAmount} ${currency} Per ${fixCasing(
                frequency
              )}`}</div>
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
          <div className={classes.flexRow}>
            <PaymentDetails info={paymentDetails} />
            <RecurringPayments installments={installments} />
          </div>
        </div>
      )}
      {response ? (
        <div
          onClick={() => {
            setDisplayId('');
            window.location.hash = '';
          }}
        >
          {JSON.stringify(response.data)}
        </div>
      ) : null}
    </div>
  );
};

export default CommitmentDetails;
