import { Meta, Story } from '@storybook/react';

import { SegmentedControl, SegmentedControlProps } from './segmented-control';
import { useState } from 'react';
import { IOption } from '../types';

export default {
  title: 'Components/SegmentedControl',
  component: SegmentedControl,

  argTypes: {
    size: { control: { type: 'select' }, options: ['md'] },
  },
} as Meta;

const Template: Story<SegmentedControlProps> = args => {
  const [value, setValue] = useState<string>(args.options[0].value);

  const handleChange = (option: IOption) => {
    setValue(args.options.find(({ value }) => value === option.value)!.value);
  };
  return <SegmentedControl {...args} value={value} onChange={handleChange} />;
};

export const Default = Template.bind({});

Default.args = {
  options: [
    { value: '1', label: 'Income123' },
    { value: '2', label: 'Expense' },
    { value: '3', label: 'Transfer123123' },
    { value: '4', label: 'Exchange' },
  ],
  size: 'md',
};
