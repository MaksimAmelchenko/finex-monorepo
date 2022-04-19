import React, { forwardRef } from 'react';
import { ReactDatePickerProps } from 'react-datepicker';

import { DatePicker } from '../date-picker/date-picker';
import { Option } from '../option/option';

const CustomInput = forwardRef<HTMLSpanElement, any>(({ label, value, onClick }, ref) => {
  return <Option label={label} onClick={onClick} />;
});

export interface InlineDatePickerProps extends Omit<ReactDatePickerProps, 'value'> {
  label: string;
  value: Date;
  onChange: (value: Date) => void;
}

export function InlineDatePicker({ label, value, onChange, ...rest }: InlineDatePickerProps) {
  return (
    <DatePicker
      {...rest}
      selected={value}
      onChange={onChange}
      customInput={<CustomInput label={label} />}
      showPopperArrow={false}
    />
  );
}
