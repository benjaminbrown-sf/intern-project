import React from 'react';

import MenuMUI from '@material-ui/core/Menu';
import { MenuItem } from '@material-ui/core';

import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(() => {
  return {
    paper: {
      '&.MuiMenu-paper': {
        boxShadow:
          '0px 1px 3px -3px rgba(0,0,0,0.10), 0px 2px 1px 1px rgba(0,0,0,0.08), 0px 1px 1px 2px rgba(0,0,0,0.12)',
        borderColor: 'red',
      },
    },
  };
});

export interface MenuItem {
  key: string;
  func: (transactionId: string) => any; // Temp; should be bool, Promise<AxiosResponse<any | undefined>>?;
}

export interface MenuProps {
  open: boolean;
  anchorEl: HTMLElement | null;
  setAnchorEl: (eventTarget: (EventTarget & HTMLButtonElement) | null) => void;
  menuItems: MenuItem[]; // node?
  onClose: (ev: React.SyntheticEvent) => void;
  transactionId: string;
}

const Menu = (props: MenuProps): JSX.Element => {
  const classes = useStyles();
  return (
    <MenuMUI
      classes={classes}
      open={props.open}
      anchorEl={props.anchorEl as any}
      onClose={props.onClose}
    >
      {props.menuItems?.map((item, key) => {
        return (
          <MenuItem key={key} onClick={() => item.func(props.transactionId)}>
            {item.key}
          </MenuItem>
        );
      })}
    </MenuMUI>
  );
};

export default Menu;
