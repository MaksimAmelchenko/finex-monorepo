import React from 'react';

import styles from './checkbox.module.scss';

export interface ICheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'value'> {
  value?: boolean;
  label: string;
  error?: string;
}

export function Checkbox({ label, disabled, value = false, error }: ICheckboxProps): JSX.Element {
  // const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
  //   onChange && onChange(event.target.checked, event);
  // };

  return (
    <label>
      <input type="checkbox" disabled={disabled} checked={value} />
      {label}
      {error && <div className={styles.error}>{error}</div>}
    </label>
  );
}
