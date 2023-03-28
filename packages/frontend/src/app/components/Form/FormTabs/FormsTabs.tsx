import React, { useCallback } from 'react';
import { useField, useFormikContext } from 'formik';

import { Tabs, TabsProps } from '../../Tabs/Tabs';

export interface FormTabsProps extends Omit<TabsProps, 'value' | 'onChange'> {
  name: string;
}

export function FormTabs(props: FormTabsProps): JSX.Element {
  const [formikProps, meta] = useField<string>(props.name);
  const { setFieldValue, setFieldTouched } = useFormikContext();

  const joinedProps = { ...props, ...formikProps };
  const isError = Boolean(meta.error);
  const { name } = props;

  const handleChange = useCallback(
    (value: string) => {
      setFieldValue(name, value);
      setFieldTouched(name, true, false);
    },
    [name, setFieldValue, setFieldTouched]
  );

  return <Tabs {...joinedProps} onChange={handleChange} />;
}
