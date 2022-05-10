import React, { useCallback } from 'react';
import { useField, useFormikContext } from 'formik';

import { ISelectOption, isMulti, SelectPopup, SelectPopupProps } from '@finex/ui-kit';
import { OnChangeValue } from 'react-select/dist/declarations/src/types';

export interface FormSelectPopupProps<IsMulti extends boolean> extends Omit<SelectPopupProps<IsMulti>, 'value'> {
  name: string;
}

export function FormSelectPopup<IsMulti extends boolean = false>(props: FormSelectPopupProps<IsMulti>): JSX.Element {
  const [formikProps, meta] = useField<IsMulti extends true ? string[] : string | null>(props.name);
  const { setFieldValue, setFieldTouched } = useFormikContext();

  const joinedProps = { ...props, ...formikProps };
  const isError = Boolean(meta.error) && meta.touched;

  const { options, name } = props;

  const value: ISelectOption | ISelectOption[] | undefined = Array.isArray(meta.value)
    ? options.filter(({ value }) => (meta.value as string[]).includes(value))
    : options.find(({ value }) => value === meta.value);

  const handleChange = useCallback(
    (newValue: OnChangeValue<ISelectOption, IsMulti>) => {
      setFieldValue(name, isMulti(newValue) ? newValue.map(({ value }) => value) : newValue?.value || null);
      setFieldTouched(name);
    },
    [name, setFieldValue, setFieldTouched]
  );

  return <SelectPopup<IsMulti> {...joinedProps} value={value} onChange={handleChange} />;
}
