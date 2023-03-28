import React from 'react';
import { Dialog } from '@mui/material';

import { DatePicker } from '@finex/ui-kit';

interface DatePickerDialogProps {
  open: boolean;
  value: Date;
  showMonthYearPicker: boolean;
  onDismiss: () => void;
  onChange: (value: Date | null) => void;
}
export const DatePickerDialog: React.FC<DatePickerDialogProps> = ({
  open,
  value,
  showMonthYearPicker = false,
  onDismiss,
  onChange,
}) => {
  return (
    <Dialog open={open} onClose={onDismiss} PaperProps={{ sx: { margin: '0' } }}>
      <DatePicker selected={value} inline onChange={onChange} showMonthYearPicker={showMonthYearPicker} />
    </Dialog>
  );
};
