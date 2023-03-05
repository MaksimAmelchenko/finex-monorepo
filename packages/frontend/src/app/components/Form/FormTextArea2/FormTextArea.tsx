import React, { forwardRef } from 'react';
import { useField } from 'formik';

import { TextArea, TextAreaProps } from '@finex/ui-kit';

export interface FormAreaFieldProps extends Omit<TextAreaProps, 'value'> {
  name: string;
}

export const FormTextAreaField = forwardRef<HTMLTextAreaElement, FormAreaFieldProps>((props, ref) => {
  const [formikProps, meta] = useField(props.name);
  const joinedProps = { ...props, ...formikProps };
  const isError = Boolean(meta.error);

  return <TextArea {...joinedProps} errorText={isError ? meta.error : ''} />;
});

FormTextAreaField.displayName = 'FormTextAreaField';
