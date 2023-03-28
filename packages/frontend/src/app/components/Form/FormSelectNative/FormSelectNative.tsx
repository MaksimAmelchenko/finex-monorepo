import React from 'react';
import { useField } from 'formik';

import { SelectNative, SelectNativeProps } from '@finex/ui-kit';

export interface IFormSelectNativeProps extends Omit<SelectNativeProps, 'value' | 'onChange'> {
  name: string;
  className?: string;
}

export function FormSelectNative(props: IFormSelectNativeProps): JSX.Element {
  const [formikProps, meta] = useField(props.name);
  const joinedProps = { ...props, ...formikProps };
  const isError = Boolean(meta.error);

  return <SelectNative {...joinedProps} errorText={isError ? meta.error : ''} />;
}
