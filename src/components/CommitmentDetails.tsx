import React from 'react';

import { useGet, CommitmentsQueryParams } from '../hooks/axiosHooks';

import theme from '../theme';
import { makeStyles } from '@material-ui/core/styles';
import CheckCircleOutlineIcon from '@material-ui/icons/CheckCircleOutline';

import PaymentDetails from './PaymentDetails';
import RecurringPayments from './RecurringPayments';

import { Button } from '@material-ui/core';

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
  };
});

const CommitmentDetails = (props: DetailProps): JSX.Element => {
  const classes = useStyles(theme);
  const { displayId, setDisplayId } = props;

  const fixCasing = (str: string) => {
    return (
      str.toLowerCase().charAt(0).toUpperCase() + str.toLowerCase().slice(1)
    );
  };

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
    pledgeAmount,
    currency,
    status,
    paymentMethod,
    schedules,
    installments,
  } = data;

  const { frequency } = schedules[0];

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
        <div>
          <div>
            <div className={classes.pageTitle}>
              <h2>Recurring Payments</h2>
              <Button></Button>
            </div>
            <div className={classes.flexRow}>
              <div>{`$ ${amountPaidToDate} ${currency} Total`}</div>
              {pledgeAmount !== null ? (
                <div>{`$ ${pledgeAmount} ${currency} Per ${frequency}`}</div>
              ) : null}

              {status === 'ACTIVE' ? (
                <div>
                  <CheckCircleOutlineIcon />
                  <div>{fixCasing(status)}</div>
                </div>
              ) : (
                <div>
                  <CheckCircleOutlineIcon />
                  <div>{fixCasing(status)}</div>
                </div>
              )}
            </div>
            <div className={classes.flexRow}>
              <div>{`${firstName} ${lastName}`}</div>
              <div>{email}</div>
            </div>
            <div className={classes.flexRow}>
              <div>{`${card}, *${Math.floor(lastFour)}`}</div>
              <div>{`Exp. ${expiration}`}</div>
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
