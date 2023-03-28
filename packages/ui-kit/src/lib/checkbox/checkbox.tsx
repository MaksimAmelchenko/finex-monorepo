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
  size = 'sm',
  ...rest
}: ICheckboxProps): JSX.Element {
  const isError = Boolean(error);

  const message = isError ? error : helperText;

  return (
    <div className={clsx(styles.root, styles[`root_size_${size}`], isError && styles.root_error)}>
      <label className={clsx(styles.root__label, disabled && styles.root__label_disabled)}>
        <BaseCheckbox {...rest} size={size} className={styles.root__checkbox} onChange={onChange} disabled={disabled} />
        <div className={styles.root__content}>{children} </div>
      </label>
      {message && <p className={styles.root__helperText}>{message}</p>}
    </div>
  );
}
