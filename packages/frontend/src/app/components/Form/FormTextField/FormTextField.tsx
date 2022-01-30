import React, { forwardRef } from 'react';

import { useField } from 'formik';
import { ITextFieldProps, TextField } from '@fnx/ui-kit';

export interface IFormTextFieldProps extends ITextFieldProps {
  name: string;
  autoFocusOnEmpty?: boolean;
  onBlur?: (e: any) => void;
  className?: string;
}

export const FormTextField = forwardRef<HTMLInputElement, IFormTextFieldProps>((props, ref) => {
  const [formikProps, meta] = useField(props.name);
  const { autoFocusOnEmpty, ...rest } = props;
  const joinedProps = { ...rest, ...formikProps };
  const isError = Boolean(meta.error) && meta.touched;

  // const inputRef = useRef<HTMLInputElement | null>(null);

  // useEffect(() => {
  //   // TODO leave focused the only first field
  //   // if (autoFocusOnEmpty && inputRef.current && !fieldProps.value) {
  //   //   inputRef.current.focus();
  //   // }
  // }, [autoFocusOnEmpty, fieldProps.value]);

  return (
    <TextField
      {...joinedProps}
      // onChange={onChange}
      error={isError ? meta.error : ''}
      // ref={ref || inputRef}
    />
  );
});

FormTextField.displayName = 'FormTextField';
