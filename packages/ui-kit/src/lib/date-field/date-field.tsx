import React, { createElement, forwardRef } from 'react';

import { CalendarDaysIcon } from '../icons';
import { DatePicker } from '../date-picker/date-picker';
import { ITextFieldProps, TextField } from '../text-field/text-field';

export interface DateFieldProps extends Omit<ITextFieldProps, 'value' | 'onChange'> {
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
  return <TextField {...props} startAdornment={CalendarDaysIcon} />;
});
