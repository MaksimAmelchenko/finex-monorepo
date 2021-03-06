import React from 'react';
import ReactDatePicker, { ReactDatePickerProps } from 'react-datepicker';

import 'react-datepicker/dist/react-datepicker.css';
import './date-picker.css';

export { ReactDatePickerProps as DatePickerProps };

export function DatePicker<WithRange extends boolean | undefined = undefined>(
  props: ReactDatePickerProps<never, WithRange>
): JSX.Element {
  return (
    <ReactDatePicker<never, WithRange>
      {...props}
      showPopperArrow={false}
      showMonthDropdown
      showYearDropdown
      dropdownMode="select"
    />
  );
}
