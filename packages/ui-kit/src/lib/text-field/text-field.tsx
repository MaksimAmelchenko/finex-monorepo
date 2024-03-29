import React, { LegacyRef, forwardRef, useId } from 'react';
import MaskedInput, { Mask, MaskedInputProps } from 'react-text-mask';
import clsx from 'clsx';

import styles from './text-field.module.scss';

export interface ITextFieldProps extends Omit<MaskedInputProps, 'css' | 'mask' | 'size' | 'value'> {
  value: string;
  className?: string;
  endAdornment?: React.FC<{ className?: string }>;
  error?: string;
  fullWidth?: boolean;
  helperText?: string;
  mask?: Mask | ((value: string) => Mask);
  size?: 'small' | 'medium'; // The size of the component.
  startAdornment?: React.FC<{ className?: string }>;
  label?: string;
}

export const TextField = forwardRef<HTMLInputElement, ITextFieldProps>((props, ref) => {
  const {
    autoComplete = 'off',
    className,
    endAdornment: EndAdornment,
    error,
    helperText,
    mask,
    name,
    size = 'medium',
    startAdornment: StartAdornment,
    label,
    type = 'text',
    value,
    ...inputProps
  } = props;

  const isError = Boolean(error);
  const id = useId();

  const message = isError ? error : helperText;
  return (
    <div
      className={clsx(
        styles.root,
        styles[`root_size_${size}`],
        isError && styles.root_error,
        value.length > 0 && styles.root_filled,
        className
      )}
    >
      <div
        className={clsx(styles.root__input, styles.input, styles[`input_size_${size}`], error && styles.input_error)}
      >
        {StartAdornment && <StartAdornment className={styles.input__startAdornment} />}
        {mask ? (
          <MaskedInput
            {...inputProps}
            value={value}
            type={type}
            id={id}
            name={name}
            className={clsx(
              //
              styles.input__field,
              // endAdornment && styles.inputStyled_rightOffset,
              !error && styles.isValid
            )}
            autoComplete={autoComplete}
            mask={mask}
            guide={false}
            ref={ref as LegacyRef<MaskedInput>}
          />
        ) : (
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
        )}
        {EndAdornment && <EndAdornment className={styles.input__endAdornment} />}
      </div>
      {label && (
        <label
          className={clsx(styles.root__label, StartAdornment && styles.root__label_withStartAdornment)}
          htmlFor={id}
        >
          {label}
        </label>
      )}
      {message && <p className={styles.root__helperText}>{message}</p>}
    </div>
  );
});

TextField.displayName = 'TextField';
