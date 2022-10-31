import React from 'react';
import clsx from 'clsx';

import { BaseCheckbox, BaseCheckboxProps } from '../base-checkbox/base-checkbox';

import styles from './checkbox.module.scss';

export interface ICheckboxProps extends BaseCheckboxProps {
  error?: string;
  helperText?: string;
  children: React.ReactNode;
}

export function Checkbox({
  disabled = false,
  error,
  onChange,
  helperText,
  children,
  ...rest
}: ICheckboxProps): JSX.Element {
  const isError = Boolean(error);

  const message = isError ? error : helperText;

  return (
    <div className={clsx(styles.container, isError && styles.container_error)}>
      <label className={clsx(styles.label, disabled && styles.label_disabled)}>
        <BaseCheckbox {...rest} className={styles.checkbox} onChange={onChange} disabled={disabled} />
        <div className={styles.content}>{children} </div>
      </label>
      {message && <p className={styles.container__helperText}>{message}</p>}
    </div>
  );
}
