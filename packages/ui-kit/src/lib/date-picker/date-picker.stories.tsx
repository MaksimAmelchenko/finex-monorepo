import React, { useState } from 'react';
import { Meta, Story } from '@storybook/react';

import { DatePicker, DatePickerProps } from './date-picker';

export default {
  title: 'Components/DatePicker',
  component: DatePicker,
  argTypes: {},
} as Meta;

const Template: Story<DatePickerProps> = args => {
  const [startDate, setStartDate] = useState<Date | null>(new Date());

  return <DatePicker {...args} selected={startDate} onChange={setStartDate} />;
};

export const Default = Template.bind({});

export const MonthPicker = Template.bind({});
MonthPicker.args = {
  dateFormat: 'MMM yyyy',
  showMonthYearPicker: true,
};
