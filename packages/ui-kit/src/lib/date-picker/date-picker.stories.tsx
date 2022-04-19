import React from 'react';
import { Meta, Story } from '@storybook/react';

import { DatePicker, DatePickerProps } from './date-picker';

export default {
  title: 'Components/DatePicker',
  component: DatePicker,
} as Meta;

const Template: Story<DatePickerProps> = props => {
  return <DatePicker {...props} />;
};

export const Default = Template.bind({});
