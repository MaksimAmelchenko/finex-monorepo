import React, { forwardRef, useId } from 'react';
import clsx from 'clsx';

import { ChevronRightIcon } from '../icons';

import styles from './input.module.scss';

export interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  value: string;
  label?: string;
  size?: 'sm';
  startAdornment?: React.ReactNode;
  endAdornment?: React.ReactNode;
  startIcon?: React.ReactNode;
  endIcon?: React.ReactNode;
  fullWidth?: boolean;
  helperText?: string;
  errorText?: string;
  className?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>((props, ref) => {
  const {
    name,
    value,
    label,
    size = 'sm',
    startAdornment: StartAdornment,
    endAdornment: EndAdornment,
    startIcon: StartIcon,
    endIcon: EndIcon,
    errorText,
    helperText,
    autoComplete = 'off',
    type = 'text',
    className,
    onClick,
    ...inputProps
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
      <div className={clsx(styles.root__input, styles.input, isError && styles.input_error)} onClick={onClick}>
        {StartAdornment}
        <div
          className={clsx(
            styles.input__content,
            Boolean(StartAdornment) && styles.input__content_withStartAdornment,
            Boolean(EndAdornment) && styles.input__content_withEndAdornment
          )}
        >
          {StartIcon && <div className={styles.input__icon}>{StartIcon}</div>}
          <input
            {...inputProps}
            type={type}
            id={id}
            name={name}
            value={value}
            className={clsx(styles.input__field)}
            autoComplete={autoComplete}
            ref={ref}
            aria-invalid={isError || undefined}
          />
          {EndIcon && <div className={styles.input__icon}>{EndIcon}</div>}
        </div>
        {EndAdornment}
      </div>
      {message && <p className={styles.root__helperText}>{message}</p>}
    </div>
  );
});

Input.displayName = 'Input';

export interface DropdownProps {
  text?: string;
  onClick: () => void;
  className?: string;
}

export function Dropdown({ text, onClick, className }: DropdownProps): JSX.Element {
  return (
    <div className={clsx(styles.dropdown, className)} onClick={onClick}>
      {text && <span dangerouslySetInnerHTML={{ __html: text }} className={styles.dropdown__text} />}
      <ChevronRightIcon className={styles.dropdown__arrow} />
    </div>
  );
}
