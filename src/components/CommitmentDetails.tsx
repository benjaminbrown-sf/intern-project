import React from 'react';

import { useGet, CommitmentsQueryParams } from '../hooks/axiosHooks';

import theme from '../theme';
import { makeStyles } from '@material-ui/core/styles';

import PaymentDetails from './PaymentDetails';
import RecurringPayments from './RecurringPayments';

export interface DetailProps {
  displayId: number | null;
  setDisplayId: any; // Terrible, but setStateAction<null> and Dispatch<setStateAction<null> are unrecognized
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
    `transactions/${displayId}`,
    queryParams
  );

  const data = response?.data;

  if (loading) {
    console.log('loading');
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

  // installment destructuring

  // schedules destructuring

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
            <h2>Recurring Payments</h2>
            <div className={classes.flexRow}>
              <div>{`$ ${amountPaidToDate} ${currency}`}</div>
              <div>{pledgeAmount}</div>
              <div>{status}</div>
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
            setDisplayId(null);
          }}
        >
          {JSON.stringify(response.data)}
        </div>
      ) : null}
    </div>
  );
};

export default CommitmentDetails;
