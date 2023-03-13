import React, { useId } from 'react';
import clsx from 'clsx';

import { ChevronRightIcon } from '../icons';
import { IOption } from '../types';

import styles from './select-native.module.scss';

export interface SelectNativeProps extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, 'size'> {
  label?: string;
  options: IOption[];
  value: string;
  size?: 'sm';
  startIcon?: React.ReactNode;
  helperText?: string;
  errorText?: string;
  className?: string;
}

export function SelectNative(props: SelectNativeProps) {
  const {
    value,
    options,
    placeholder,
    label,
    size = 'sm',
    startIcon: StartIcon,
    errorText,
    helperText,
    className,
    ...selectProps
  } = props;
  const id = useId();

  const isError = Boolean(errorText);

  const message = isError ? errorText : helperText;

  return (
    <div className={clsx(styles.root, className, isError && styles.root_error)}>
      {label && (
        <label className={styles.root__label} htmlFor={id}>
          {label}
        </label>
      )}
      <div className={clsx(styles.root__select, styles.select, isError && styles.select_error)}>
        <div className={styles.select__content}>
          {StartIcon && <div className={clsx(styles.select__icon, styles.select__icon_startIcon)}>{StartIcon}</div>}
          <select
            {...selectProps}
            id={id}
            value={value}
            className={clsx(
              styles.select__field,
              placeholder && !value && styles.select__field_placeholder,
              Boolean(StartIcon) && styles.select__field_withStartIcon
            )}
            aria-invalid={isError || undefined}
          >
            {placeholder && (
              <option disabled selected hidden value="" className={styles.select__placeholder}>
                {placeholder}
              </option>
            )}
            {options.map(option => {
              return (
                <option value={option.value} key={option.value}>
                  {option.label}
                </option>
              );
            })}
          </select>
        </div>
        <div className={styles.dropdown}>
          <ChevronRightIcon className={styles.dropdown__arrow} />
        </div>
      </div>
      {message && <p className={styles.root__helperText}>{message}</p>}
    </div>
  );
}
