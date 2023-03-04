import React, { useState } from 'react';
import { Meta, Story } from '@storybook/react';

import { DateField, DateFieldProps } from './date-field';

export default {
  title: 'Components/DateField',
  component: DateField,
  argTypes: {
    size: { options: ['small', 'medium'], control: { type: 'select' } },
    error: { control: { type: 'text' } },
    placeholder: { control: { type: 'text' } },
    label: { control: { type: 'text' } },
    helperText: { control: { type: 'text' } },
  },
} as Meta;

const Template: Story<DateFieldProps> = args => {
  const [value, setValue] = useState<Date | null>(new Date());

  return <DateField {...args} value={value} onChange={setValue} />;
};

export const Default = Template.bind({});
Default.args = {
  size: 'medium',
  label: 'Date',
  // placeholder: 'Placeholder',
  error: 'Error',
  helperText: 'Helper Text',
};
