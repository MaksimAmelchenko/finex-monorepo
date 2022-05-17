import React, { ChangeEvent, useId } from 'react';
import clsx from 'clsx';

import styles from './checkbox.module.scss';

export interface ICheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'id' | 'value' | 'onChange'> {
  value?: boolean;
  label?: string;
  error?: string;
  helperText?: string;
  onChange: (value: boolean, event: ChangeEvent<HTMLInputElement>) => unknown;
}

export function Checkbox({
  label,
  disabled,
  value = false,
  onChange,
  error,
  helperText,
  ...rest
}: ICheckboxProps): JSX.Element {
  const id = useId();

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    onChange(event.target.checked, event);
  };
  const isError = Boolean(error);

  const message = isError ? error : helperText;

  return (
    <div className={clsx(styles.container, isError && styles.container_error)}>
      <input
        type="checkbox"
        {...rest}
        id={id}
        disabled={disabled}
        checked={value}
        onChange={handleChange}
        className={styles.checkbox}
      />
      <label htmlFor={id}>{label}</label>
      {message && <p className={styles.container__helperText}>{message}</p>}
    </div>
  );
}
