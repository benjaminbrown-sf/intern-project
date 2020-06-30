import React from 'react';
import {
  createMuiTheme,
  ThemeProvider,
  makeStyles,
} from '@material-ui/core/styles';
import theme from './theme';

import RecurringPaymentsTable from './components/RecurringPaymentsTable';
import CommitmentDetails from './components/CommitmentDetails';

const MUITheme = createMuiTheme(theme);

// css styles for App are specified here. The className is generated by 'makeStyles' when
// the 'useAppStyles' hook is run
const useAppStyles = makeStyles(theme => {
  return {
    app: {
      textAlign: 'center',
      marginLeft: '150px',
      marginRight: '150px',
    },
    appHeader: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: 'calc(10px + 2vmin)',
      color: 'white',
      marginBottom: '16px',
    },
    appLogo: {
      height: '100px',
      pointerEvents: 'none',
    },
    errorText: {
      color: theme.palette.error.main,
    },
    response: {
      fontFamily: 'monospace',
      whiteSpace: 'pre',
      textAlign: 'left',
    },
  };
});

const App = (): JSX.Element => {
  const classes = useAppStyles(theme);

  // This Hook is used to keep track of whether to render the table or CommitmentDetails
  // const [displayDetails, setDisplayDetails] = React.useState(false);
  // This Hook is used to keep track of which CommitmentDetails should be displayed
  const [displayId, setDisplayId] = React.useState(
    window.location.hash.slice(1) || ''
  );
  return (
    <ThemeProvider theme={MUITheme}>
      <div className={classes.app}>
        <header className={classes.appHeader}>
          <img src="logo.png" className={classes.appLogo} alt="logo" />
        </header>
        <div>
          {displayId !== '' ? (
            <CommitmentDetails
              displayId={displayId}
              setDisplayId={setDisplayId}
            />
          ) : (
            <RecurringPaymentsTable setDisplayId={setDisplayId} />
          )}
        </div>
      </div>
    </ThemeProvider>
  );
};

export default App;
