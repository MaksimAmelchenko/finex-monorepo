import React, { forwardRef } from 'react';

import { useField } from 'formik';
import { ITextFieldProps, TextField } from '@finex/ui-kit';

export interface IFormTextFieldProps extends Omit<ITextFieldProps, 'value'> {
  name: string;
  autoFocusOnEmpty?: boolean;
  onBlur?: (e: any) => void;
  className?: string;
}

export const FormTextField = forwardRef<HTMLInputElement, IFormTextFieldProps>((props, ref) => {
  const [formikProps, meta] = useField(props.name);
  const { autoFocusOnEmpty, ...rest } = props;
  const joinedProps = { ...rest, ...formikProps };
  const isError = Boolean(meta.error);

  return <TextField {...joinedProps} error={isError ? meta.error : ''} ref={ref} />;
});

FormTextField.displayName = 'FormTextField';
