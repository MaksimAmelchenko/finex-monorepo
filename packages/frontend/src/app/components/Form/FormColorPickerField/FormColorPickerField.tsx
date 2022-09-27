import React, { useCallback } from 'react';
import { useField, useFormikContext } from 'formik';

import { ColorPicker, ColorPickerProps } from '@finex/ui-kit';

export interface FormColorPickerFieldProps extends Omit<ColorPickerProps, 'value' | 'onChange'> {
  name: string;
  className?: string;
}

export const FormColorPickerField = (props: FormColorPickerFieldProps): JSX.Element => {
  const [formikProps] = useField<string | null>(props.name);
  const joinedProps = { ...props, ...formikProps };

  const { setFieldValue, setFieldTouched } = useFormikContext<any>();

  const handleChange = useCallback(
    (value: string) => {
      setFieldValue(props.name, value);
      setFieldTouched(props.name);
    },
    [props.name, setFieldValue, setFieldTouched]
  );

  return <ColorPicker {...joinedProps} onChange={handleChange} />;
};
