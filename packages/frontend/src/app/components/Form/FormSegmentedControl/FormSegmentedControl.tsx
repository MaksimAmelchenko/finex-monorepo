import React, { useCallback } from 'react';
import { useField, useFormikContext } from 'formik';

import { IOption, SegmentedControl, SegmentedControlProps } from '@finex/ui-kit';

export interface FormSegmentedControlProps extends Omit<SegmentedControlProps, 'value' | 'onChange'> {
  name: string;
}

export function FormSegmentedControl(props: FormSegmentedControlProps): JSX.Element {
  const [formikProps] = useField<string>(props.name);
  const { setFieldValue, setFieldTouched } = useFormikContext();

  const joinedProps = { ...props, ...formikProps };
  const { name } = props;

  const handleChange = useCallback(
    ({ value }: IOption) => {
      setFieldValue(name, value);
      setFieldTouched(name, true, false);
    },
    [name, setFieldValue, setFieldTouched]
  );

  return <SegmentedControl {...joinedProps} onChange={handleChange} />;
}
