import React, { LegacyRef } from 'react';
import MaskedInput, { Mask, MaskedInputProps } from 'react-text-mask';
import clsx from 'clsx';

import styles from './text-field.module.scss';

export interface ITextFieldProps extends Omit<MaskedInputProps, 'css' | 'mask' | 'size'> {
  className?: string;
  endAdornment?: any;
  error?: string;
  fullWidth?: boolean;
  helperText?: string;
  mask?: Mask | ((value: string) => Mask);
  size?: 'small' | 'medium'; // The size of the component.
  startAdornment?: any;
  label: string;
}

export const TextField = React.forwardRef<HTMLInputElement, ITextFieldProps>((props, ref) => {
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
    id = name,
    type = 'text',
    ...inputProps
  } = props;

  const isError = Boolean(error);

  const message = isError ? error : helperText;
  return (
    <div
      className={clsx(
        styles.root,
        error && styles.root_error,
        (inputProps.value as string).length > 0 && styles.root_filled,
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
            type={type}
            id={id}
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
            className={clsx(
              //
              styles.input__field
              // endAdornment && styles.inputStyled_rightOffset
            )}
            autoComplete={autoComplete}
            ref={ref}
          />
        )}
        {EndAdornment && <EndAdornment className={styles.input__endAdornment} />}
      </div>
      <label className={styles.root__label} htmlFor={id}>
        {label}
      </label>
      {message && <p className={styles.root__helperText}>{message}</p>}
    </div>
  );
});

TextField.displayName = 'TextField';
