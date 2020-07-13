import React from 'react';
import ButtonMui from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(() => {
  return {
    invisButton: {
      boxShadow: 'none',
      backgroundColor: 'white',
      '&:hover': {
        backgroundColor: 'white',
      },
    },
  };
});

export interface ButtonProps {
  type: 'inherit' | 'primary' | 'secondary' | 'default' | undefined;
  disabled?: boolean;
  children?: React.ReactNode;
  onClick?: (ev: React.SyntheticEvent) => void;
  visible?: boolean;
}

const Button = (props: ButtonProps): JSX.Element => {
  const classes = useStyles();
  return (
    <ButtonMui
      className={props.visible ? undefined : classes.invisButton}
      variant="contained"
      onClick={props.onClick}
      disabled={props.disabled}
      color={props.type}
    >
      {props.children}
    </ButtonMui>
  );
};

export default Button;
