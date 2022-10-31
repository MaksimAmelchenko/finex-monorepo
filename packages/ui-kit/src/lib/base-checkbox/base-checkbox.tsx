import React, { ChangeEvent, useEffect, useRef } from 'react';
import clsx from 'clsx';

import styles from './base-checkbox.module.scss';

export interface BaseCheckboxProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'name' | 'value' | 'type' | 'checked' | 'onChange'> {
  name?: string;
  value: boolean;
  onChange?: (value: boolean, event: ChangeEvent<HTMLInputElement>) => unknown;
  indeterminate?: boolean;
  className?: string;
}

export const BaseCheckbox = ({
  name,
  value = false,
  onChange,
  indeterminate = false,
  className,
  ...inputProps
}: BaseCheckboxProps) => {
  const checkboxRef = useRef<any>();

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    onChange && onChange(event.target.checked, event);
  };

  useEffect(() => {
    if (checkboxRef.current && indeterminate) {
      checkboxRef.current.indeterminate = indeterminate;
    } else {
      checkboxRef.current.indeterminate = false;
    }
  }, [indeterminate]);

  return (
    <input
      type="checkbox"
      name={name}
      className={clsx(styles.input, className)}
      checked={value}
      onChange={handleChange}
      ref={checkboxRef}
      {...inputProps}
    />
  );
};
