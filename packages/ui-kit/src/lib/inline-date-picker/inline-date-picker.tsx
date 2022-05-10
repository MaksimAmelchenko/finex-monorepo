import React, { createElement, forwardRef } from 'react';
import { ReactDatePickerProps } from 'react-datepicker';

import { DatePicker } from '../date-picker/date-picker';
import { Option } from '../option/option';

const CustomInput = forwardRef<HTMLSpanElement, DatePickerTargetProps>(({ label, rawValue, onClick }, ref) => {
  return <Option label={label} onClick={onClick} />;
});

export interface DatePickerTargetProps {
  label: string;
  rawValue: Date;
  onClick: (event: React.MouseEvent<HTMLElement>) => void;
}

export interface InlineDatePickerProps extends Omit<ReactDatePickerProps, 'value'> {
  label?: string;
  value: Date | null;
  onChange: (value: Date) => void;
  target?: React.ForwardRefExoticComponent<React.PropsWithoutRef<DatePickerTargetProps> & React.RefAttributes<any>>;
}

export function InlineDatePicker({ label, value, target = CustomInput, onChange, ...rest }: InlineDatePickerProps) {
  return (
    <DatePicker
      {...rest}
      selected={value}
      onChange={onChange}
      customInput={createElement<any>(target, { label, rawValue: value })}
      showPopperArrow={false}
    />
  );
}
