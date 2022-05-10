import React, { ChangeEvent, useId } from 'react';

import styles from './checkbox.module.scss';

export interface ICheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'id' | 'value' | 'onChange'> {
  value?: boolean;
  label?: string;
  error?: string;
  onChange: (value: boolean, event: ChangeEvent<HTMLInputElement>) => unknown;
}

export function Checkbox({ label, disabled, value = false, onChange, error, ...rest }: ICheckboxProps): JSX.Element {
  const id = useId();

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    onChange(event.target.checked, event);
  };

  return (
    <div className={styles.container}>
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
      {error && <div className={styles.error}>{error}</div>}
    </div>
  );
}
