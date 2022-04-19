import React, { useState } from 'react';
import { Meta, Story } from '@storybook/react';

import { InlineDatePicker, InlineDatePickerProps } from './inline-date-picker';

export default {
  title: 'Components/InlineDatePicker',
  component: InlineDatePicker,
} as Meta;

const Template: Story<InlineDatePickerProps> = () => {
  const [value, setValue] = useState<Date>(new Date());

  return <InlineDatePicker label={value.toISOString()} value={value} onChange={setValue} />;
};

export const Default = Template.bind({});
