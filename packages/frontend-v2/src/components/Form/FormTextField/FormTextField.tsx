import { h } from 'preact';
import { forwardRef } from 'preact/compat';
import { useField } from 'formik';

import { ITextFieldProps, TextField } from '../../TextField/TextField';
import { useEffect, useRef } from 'preact/hooks';

export interface IFormTextFieldProps extends ITextFieldProps {
  name: string;
  label?: string;
  autoFocusOnEmpty?: boolean;
  onBlur?: (e: any) => void;
  className?: string;
}

export const FormTextField = forwardRef<HTMLInputElement, IFormTextFieldProps>((props, ref) => {
  const [fieldProps, meta] = useField(props.name);
  const { onChange, ...rest } = props;
  const joinedProps = { ...rest, ...fieldProps };
  const isError = Boolean(meta.error) && meta.touched;
  const { autoFocusOnEmpty } = props;

  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    // TODO leave focused the only first field
    // if (autoFocusOnEmpty && inputRef.current && !fieldProps.value) {
    //   inputRef.current.focus();
    // }
  }, [autoFocusOnEmpty, fieldProps.value]);

  return (
    <TextField
      {...joinedProps}
      onInput={onChange}
      error={isError ? meta.error : ''}
      ref={ref || inputRef}
      onBlur={props.onBlur}
    />
  );
});

FormTextField.displayName = 'FormTextField';
