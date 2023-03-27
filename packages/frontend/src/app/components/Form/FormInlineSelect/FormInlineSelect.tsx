import React, { useCallback } from 'react';
import { useField, useFormikContext } from 'formik';

import { InlineSelect, InlineSelectProps, IOption } from '@finex/ui-kit';

export interface FormInlineSelectProps extends Omit<InlineSelectProps, 'label' | 'onChange'> {
  name: string;
}

export function FormInlineSelect(props: FormInlineSelectProps): JSX.Element {
  const [formikProps, meta] = useField<string>(props.name);
  const { setFieldValue, setFieldTouched } = useFormikContext();

  const joinedProps = { ...props, ...formikProps };

  const { options, name } = props;

  const option: IOption | undefined = options.find(({ value }) => value === meta.value);

  const handleChange = useCallback(
    (option: IOption) => {
      setFieldValue(name, option.value);
      setFieldTouched(name, true, false);
    },
    [name, setFieldTouched, setFieldValue]
  );

  return <InlineSelect {...joinedProps} label={option ? option.label : ''} onChange={handleChange} />;
}
