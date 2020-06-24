import React from 'react';

import { useGet, CommitmentsQueryParams } from '../hooks/axiosHooks';

import theme from '../theme';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(theme => {
  return {
    errorText: {
      color: theme.palette.error.main,
    },
  };
});

export interface DetailProps {
  displayId: number | null;
  setDisplayId: any; // Terrible, but setStateAction<null> and Dispatch<setStateAction<null> are unrecognized
}

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

  return (
    <div>
      {loading ? <p>Loading...</p> : null}
      {error ? (
        <p className={classes.errorText}>
          There was an error making the request.
        </p>
      ) : null}
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
