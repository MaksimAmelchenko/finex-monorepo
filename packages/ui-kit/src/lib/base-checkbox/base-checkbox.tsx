import React, { useEffect, useRef } from 'react';
import clsx from 'clsx';

import styles from './base-checkbox.module.scss';

export interface BaseCheckboxProps
  extends Omit<
    React.InputHTMLAttributes<HTMLInputElement>,
    'name' | 'value' | 'type' | 'checked' | 'onChange' | 'size'
  > {
  size?: 'sm' | 'md';
  name?: string;
  value: boolean;
  onChange?: (value: boolean, event: React.ChangeEvent<HTMLInputElement>) => unknown;
  indeterminate?: boolean;
  className?: string;
}

export const BaseCheckbox = ({
  name,
  size = 'sm',
  value = false,
  onChange,
  indeterminate = false,
  className,
  ...inputProps
}: BaseCheckboxProps) => {
  const checkboxRef = useRef<any>();

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
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
      className={clsx(styles.root, styles[`root_size_${size}`], className)}
      checked={value}
      onChange={handleChange}
      ref={checkboxRef}
      {...inputProps}
    />
  );
};
