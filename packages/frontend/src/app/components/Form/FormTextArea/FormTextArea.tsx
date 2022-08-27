import React, { forwardRef } from 'react';
import { useField } from 'formik';

import { TextAreaField, TextAreaFieldProps } from '@finex/ui-kit';

export interface FormAreaFieldProps extends Omit<TextAreaFieldProps, 'value'> {
  name: string;
  className?: string;
}

export const FormTextAreaField = forwardRef<HTMLTextAreaElement, FormAreaFieldProps>((props, ref) => {
  const [formikProps, meta] = useField(props.name);
  const joinedProps = { ...props, ...formikProps };
  const isError = Boolean(meta.error);

  return <TextAreaField {...joinedProps} error={isError ? meta.error : ''} />;
});

FormTextAreaField.displayName = 'FormTextAreaField';
