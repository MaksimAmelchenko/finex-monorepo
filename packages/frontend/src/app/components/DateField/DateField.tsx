import React, { forwardRef, useCallback, useState } from 'react';
import { useField, useFormikContext } from 'formik';

import { CalendarIcon, Input, InputProps } from '@finex/ui-kit';
import { DatePickerDialog } from '../DatePickerDialog/DatePickerDialog';
import { formatDate } from '../../lib/core/i18n';

interface DateFieldProps extends Omit<InputProps, 'name' | 'value'> {
  name: string;
  label?: string;
  dateFormat: string;
  showMonthYearPicker?: boolean;
}

export const DateField = forwardRef<HTMLInputElement, DateFieldProps>(
  ({ name, dateFormat, showMonthYearPicker = false, ...props }, ref) => {
    const [openDatePicker, setOpenDatePicker] = useState<boolean>(false);

    const { setFieldValue, setFieldTouched } = useFormikContext<any>();
    const [{ value }] = useField(name);

    const handleChange = useCallback(
      (value: Date | null) => {
        setFieldValue(name, value);
        setFieldTouched(name, true, false);
        setOpenDatePicker(false);
      },
      [name, setFieldTouched, setFieldValue]
    );

    const handleClick = useCallback(() => {
      setOpenDatePicker(true);
    }, []);

    const handleDatePickerDialogDismiss = useCallback(() => {
      setOpenDatePicker(false);
    }, []);

    return (
      <>
        <Input
          {...props}
          startIcon={<CalendarIcon />}
          onClick={handleClick}
          value={formatDate(value.toISOString(), dateFormat)}
          readOnly
        />

        <DatePickerDialog
          value={value}
          open={openDatePicker}
          showMonthYearPicker={showMonthYearPicker}
          onDismiss={handleDatePickerDialogDismiss}
          onChange={handleChange}
        />
      </>
    );
  }
);
