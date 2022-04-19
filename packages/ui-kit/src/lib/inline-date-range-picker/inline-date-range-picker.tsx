import React, { forwardRef, useEffect, useState } from 'react';

import { DatePicker } from '../date-picker/date-picker';
import { Option } from '../option/option';

import styles from './inline-date-range-picker.module.scss';
import { ReactDatePickerProps } from 'react-datepicker';

// eslint-disable-next-line @typescript-eslint/no-empty-function
const noop = () => {};

const CustomInput = forwardRef<HTMLSpanElement, any>(({ label, value, onClick }, ref) => {
  return <Option label={label} onClick={onClick} />;
});

export interface InlineDateRangePickerProps extends Omit<ReactDatePickerProps, 'values' | 'onChange'> {
  labels: [string, string];
  values: [Date, Date];
  onChange: (values: [Date, Date]) => void;
  delimiter?: string;
}

export function InlineDateRangePicker({
  labels,
  values,
  onChange,
  delimiter = '&nbsp;–&nbsp;',
  ...rest
}: InlineDateRangePickerProps) {
  const [startDate, setStartDate] = useState<Date | null>(values[0]);
  const [endDate, setEndDate] = useState<Date | null>(values[1]);

  useEffect(() => {
    if (startDate && endDate) {
      onChange([startDate, endDate]);
    }
  }, [onChange, startDate, endDate]);

  return (
    <div className={styles.container}>
      <DatePicker
        {...rest}
        selected={startDate}
        onChange={setStartDate}
        selectsStart
        startDate={startDate}
        endDate={endDate}
        customInput={<CustomInput label={labels[0]} />}
      />
      <div>
        <Option label={delimiter} onClick={noop} />
      </div>
      <DatePicker
        {...rest}
        selected={endDate}
        onChange={setEndDate}
        selectsEnd
        startDate={startDate}
        endDate={endDate}
        customInput={<CustomInput label={labels[1]} />}
        minDate={startDate}
      />
    </div>
  );
}
