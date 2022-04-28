import React, { forwardRef, useState } from 'react';
import { Meta, Story } from '@storybook/react';

import { InlineDatePicker, InlineDatePickerProps } from './inline-date-picker';
import { Option } from '../option/option';
import { Button } from '../button/button';

export default {
  title: 'Components/InlineDatePicker',
  component: InlineDatePicker,
} as Meta;

const ButtonInput = forwardRef<HTMLSpanElement, any>(({ label, value, onClick }, ref) => {
  return <Button onClick={onClick}>{label}</Button>;
});

const Template: Story<InlineDatePickerProps> = ({ target }) => {
  const [value, setValue] = useState<Date>(new Date());

  return <InlineDatePicker label={value.toISOString()} value={value} onChange={setValue} target={target} />;
};

export const DefaultTarget = Template.bind({});

export const ButtonTarget = Template.bind({});
ButtonTarget.args = {
  target: ButtonInput,
};
