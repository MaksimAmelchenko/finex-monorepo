import React from 'react';
import { OptionsObject, useSnackbar, WithSnackbarProps } from 'notistack';

let snackbarRef: WithSnackbarProps;

export const SnackbarUtilsConfigurator = () => {
  snackbarRef = useSnackbar();
  return null;
};

export const SnackbarUtils = {
  success(msg: string, options: OptionsObject = {}): void {
    this.toast(msg, { ...options, variant: 'success' });
  },
  warning(msg: string, options: OptionsObject = {}): void {
    this.toast(msg, { ...options, variant: 'warning' });
  },
  info(msg: string, options: OptionsObject = {}): void {
    this.toast(msg, { ...options, variant: 'info' });
  },
  error(msg: string, options: OptionsObject = {}): void {
    this.toast(msg, { ...options, variant: 'error' });
  },
  toast(msg: string, options: OptionsObject = {}): void {
    snackbarRef.enqueueSnackbar(msg, options);
  },
};
