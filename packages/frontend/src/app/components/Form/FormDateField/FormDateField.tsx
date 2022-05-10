import React, { useCallback } from 'react';
import { useField, useFormikContext } from 'formik';

import { DateField, DateFieldProps } from '@finex/ui-kit';

export interface FormDateFieldProps extends Omit<DateFieldProps, 'value' | 'onChange'> {
  name: string;
}

export function FormDateField(props: FormDateFieldProps): JSX.Element {
  const [formikProps, meta] = useField(props.name);
  const { setFieldValue } = useFormikContext();

  const joinedProps = { ...props, ...formikProps };
  const isError = Boolean(meta.error) && meta.touched;
  const { name } = props;
  const handleChange = useCallback(
    (value: Date | null) => {
      setFieldValue(name, value);
    },
    [name, setFieldValue]
  );

  return <DateField {...joinedProps} onChange={handleChange} error={isError ? meta.error : ''} />;
}
