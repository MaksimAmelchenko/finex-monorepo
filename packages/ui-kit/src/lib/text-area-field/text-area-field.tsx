import React, { forwardRef, useId } from 'react';
import clsx from 'clsx';
import TextareaAutosize, { TextareaAutosizeProps } from 'react-textarea-autosize';

import styles from './text-area-field.module.scss';

export interface TextAreaFieldProps extends TextareaAutosizeProps {
  value: string;
  className?: string;
  error?: string;
  fullWidth?: boolean;
  helperText?: string;
  label?: string;
}

export const TextAreaField = forwardRef<HTMLTextAreaElement, TextAreaFieldProps>((props, ref) => {
  const { className, error, helperText, label, name, value, minRows = 2, ...textareaProps } = props;

  const isError = Boolean(error);
  const id = useId();

  const message = isError ? error : helperText;
  return (
    <div className={clsx(styles.root, error && styles.root_error, value.length > 0 && styles.root_filled, className)}>
      <div className={clsx(styles.root__textarea, styles.textarea, error && styles.textarea_error)}>
        <TextareaAutosize
          {...textareaProps}
          minRows={minRows}
          id={id}
          name={name}
          value={value}
          className={clsx(styles.textarea__field)}
          ref={ref}
        />
      </div>
      <label className={clsx(styles.root__label)} htmlFor={id}>
        {label}
      </label>
      {message && <p className={styles.root__helperText}>{message}</p>}
    </div>
  );
});

TextAreaField.displayName = 'TextAreaField';
