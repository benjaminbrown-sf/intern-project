import React from 'react';
import { Dialog, DialogTitle, Button } from '@material-ui/core/';
import { makeStyles } from '@material-ui/core/styles';

const useAppStyles = makeStyles(() => {
  return {
    buttonsContainer: {
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'flex-end',
    },
    dialogContainer: {
      borderRadius: '25px',
      padding: '20px',
    },
    button: {
      margin: '10px',
    },
    textContainer: {
      display: 'flex',
      justifyContent: 'center',
      marginLeft: '15px',
    },
  };
});

export interface ConfirmationProps {
  text: string;
  cancelLabel: string;
  confirmLabel: string;
  onConfirmClick: (ev: React.SyntheticEvent) => void;
  onCancelClick: (ev: React.SyntheticEvent) => void;
  open: boolean;
  confirmationTitle: string;
}

const Confirmation = (props: ConfirmationProps): JSX.Element => {
  const classes = useAppStyles();

  return (
    <Dialog className={classes.dialogContainer} open={props.open}>
      <div>
        <DialogTitle>{props.confirmationTitle}</DialogTitle>
        <div className={classes.textContainer}>
          <p>{props.text}</p>
        </div>

        <div className={classes.buttonsContainer}>
          <Button
            className={classes.button}
            variant="outlined"
            color="primary"
            onClick={props.onCancelClick}
          >
            {props.cancelLabel}
          </Button>
          <Button
            className={classes.button}
            variant="contained"
            color="primary"
            onClick={props.onConfirmClick}
          >
            {props.confirmLabel}
          </Button>
        </div>
      </div>
    </Dialog>
  );
};

export default Confirmation;
