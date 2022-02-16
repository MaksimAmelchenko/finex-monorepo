import React, { useCallback } from 'react';
import { useField, useFormikContext } from 'formik';

import { Checkbox, ICheckboxProps } from '@finex/ui-kit';

export interface IFormCheckboxProps extends ICheckboxProps {
  name: string;
  disabled?: boolean;
  className?: string;
}

export const FormCheckbox = (props: IFormCheckboxProps): JSX.Element => {
  const [formikProps, meta] = useField<boolean>(props.name);
  const joinedProps = { ...props, ...formikProps };
  const isError = Boolean(meta.error) && meta.touched;

  const { setFieldValue, setFieldTouched } = useFormikContext<any>();

  const handleChange = useCallback(
    (target: any) => {
      setFieldValue(props.name, target.checked);
      setFieldTouched(props.name);
    },
    [props.name, setFieldValue, setFieldTouched]
  );

  return <Checkbox {...joinedProps} onClick={handleChange} error={isError ? meta.error : ''} />;
};
