import React, { useEffect, useRef } from 'react';
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

  // This Hook is used to keep track of which CommitmentDetails should be displayed
  const [displayId, setDisplayId] = React.useState(
    window.location.hash.slice(1) || ''
  );

  // This is intended to be used for more generalized purposes
  const [history, setHistory] = React.useState([] as string[]); // May not need to be a hook

  const isInDoc = useRef(true);

  // const getHash = () => {
  //   return history[history.length - 1];
  // };

  // const updateHistory = newUrl => {
  //   setHistory([...history, window.location.hash]);
  //   window.location.hash = newUrl;
  // };

  // Intended for future functionality
  const goBack = () => {
    window.location.hash = history[history.length - 1];
    setHistory(history.slice(0, -1)); // Should effectively be an inverted pop
  };

  useEffect(() => {
    // The purpose of these event listeners is to determine the difference between the on-page and browser back buttons
    window.addEventListener('mouseenter', () => {
      isInDoc.current = true;
    });
    window.addEventListener('mouseleave', () => {
      isInDoc.current = false;
    });
    window.addEventListener('hashchange', () => {
      // If the in-doc back-button is used
      if (isInDoc.current) {
        // If the App is displaying table
        if (window.location.hash === '') {
          // Nothing needs to happen
          setDisplayId('');
        }
      } else {
        // If there is no browser history
        if (window.location.hash !== '#undefined') {
          setDisplayId('');
          window.location.hash = '';
        } else {
          goBack();
        }
      }
    });
    // window.addEventListener('hashchange', () => {
    //   // If we are not using the in-app button (handled elsewhere)
    //   if (!isInDoc.current) {
    //     // If there are history items
    //     if (window.location.hash !== '#undefined') {
    //       // If we are not on the table
    //       if (displayId !== '') {
    //         // setDisplayId('');
    //         goBack();
    //       } else {
    //         // const newId = getHash();
    //         // setDisplayId(newId);
    //         goBack();

    //       }
    //     } else {
    //       // If no history items, reload
    //       window.location.reload();
    //     }
    //   }
    // });
  });

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
