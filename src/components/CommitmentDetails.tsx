import React from 'react';
import axios from 'axios';

import {
  useGet,
  CommitmentsQueryParams,
  clearCache,
} from '../hooks/axiosHooks';

import { fixCasing } from 'utils';

import theme from 'theme';

import { makeStyles } from '@material-ui/core/styles';
import { Divider, Button } from '@material-ui/core';

import CheckCircleOutlineIcon from '@material-ui/icons/CheckCircleOutline';
import CircularProgress from '@material-ui/core/CircularProgress';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import PaymentIcon from '@material-ui/icons/Payment';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import HighlightOffIcon from '@material-ui/icons/HighlightOff';

import PaymentDetails from './PaymentDetails';
import RecurringPayments from './RecurringPayments';
import Confirmation from '../elements/Confirmation';

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
      color: theme.palette.success.main,
      marginRight: '10px',
      transform: 'scale(1.5)',
    },
    crossCircle: {
      color: theme.palette.error.main,
      marginRight: '10px',
      transform: 'scale(1.5)',
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
      alignItems: 'center',
      height: '36px',
    },
    cancelButton: {
      marginTop: '1px',
    },
    buttonContainer: {
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      marginTop: '-3px',
    },
  };
});

const BASE_URL = 'http://localhost:9998';

export interface DetailProps {
  displayId: string;
  changeHash: (newHash: string) => void;
}

const CommitmentDetails = (props: DetailProps): JSX.Element => {
  const classes = useStyles(theme);
  const { displayId, changeHash } = props;

  const [shouldUpdateData, setShouldUpdateData] = React.useState(false);
  const [open, setOpen] = React.useState(false);

  const queryParams: CommitmentsQueryParams = {
    limit: 1,
    page: 0,
  };

  const [response, loading, error] = useGet(
    `commitment/${displayId}`,
    queryParams
  );

  if (loading) {
    return <CircularProgress />;
  }

  if (error) {
    console.error('An error has occurred with the Get Request');
  }

  const data = response && response.data; // S/N: same as response?.data

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

  const cancelCommitment = async commitmentId => {
    try {
      const res = await axios.post(`${BASE_URL}/commitment/${commitmentId}`);
      console.log(res.data.status);
    } catch (error) {
      console.error(error);
    }
  };

  if (shouldUpdateData) {
    setShouldUpdateData(false);
  }

  return (
    <div>
      {error ? (
        <p className={classes.errorText}>
          There was an error making the request.
        </p>
      ) : null}

      {loading ? (
        <CircularProgress />
      ) : (
        <div>
          <div>
            <div className={classes.titleContainer}>
              <div className={classes.buttonContainer}>
                <Button variant="outlined" color="primary" size="small">
                  <ArrowBackIcon
                    onClick={() => {
                      changeHash('');
                    }}
                  />
                </Button>
              </div>
              <Button
                className={classes.cancelButton}
                variant="contained"
                color="primary"
                size="medium"
                onClick={() => {
                  setOpen(true);
                }}
              >
                {fixCasing('Stop Recurring Donation')}
              </Button>
            </div>
            <div>
              <h2 className={classes.pageTitle}>Recurring Payment</h2>
            </div>
            <div className={classes.paymentContainer}>
              <div className={classes.textBold}>{`$${
                amountPaidToDate / 1000
              } ${currency} Total`}</div>
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
                  <HighlightOffIcon className={classes.crossCircle} />
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
          <Confirmation
            text={`This will stop all future installments for this recurring donation for ${firstName} ${lastName} immediately.`}
            cancelLabel={'Cancel'}
            confirmLabel={'Stop Recurring Donation'}
            onConfirmClick={(ev: React.SyntheticEvent) => {
              clearCache();
              cancelCommitment(id);
              setOpen(false);
              setShouldUpdateData(true);
            }}
            open={open}
            confirmationTitle={'Stop Recurring Donation'}
            onCancelClick={() => {
              setOpen(false);
            }}
          />
        </div>
      )}
    </div>
  );
};

export default CommitmentDetails;
