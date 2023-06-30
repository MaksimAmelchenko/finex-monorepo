import React, { createElement, forwardRef } from 'react';

import { CalendarIcon } from '../icons';
import { DatePicker } from '../date-picker/date-picker';
import { Input, InputProps } from '../input/input';

export interface DateFieldProps extends Omit<InputProps, 'value' | 'onChange'> {
  value: Date | null;
  onChange: (value: Date | null) => unknown;
  dateFormat?: string | string[];
  showMonthYearPicker?: boolean;
}

export function DateField({ value, onChange, dateFormat, showMonthYearPicker, className, ...rest }: DateFieldProps) {
  return (
    <div className={className}>
      <DatePicker
        selected={value}
        onChange={onChange}
        dateFormat={dateFormat}
        strictParsing
        showMonthYearPicker={showMonthYearPicker}
        customInput={createElement<any>(CustomInput, { ...rest })}
      />
    </div>
  );
}

const CustomInput = forwardRef<HTMLElement, any>((props, ref) => {
  return <Input {...props} startIcon={<CalendarIcon />} />;
});
