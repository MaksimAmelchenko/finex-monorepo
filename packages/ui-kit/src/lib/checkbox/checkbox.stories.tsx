import { Meta, Story } from '@storybook/react';
import { Checkbox, ICheckboxProps } from './checkbox';
import { useState } from 'react';

export default {
  title: 'Components/Checkbox',
  component: Checkbox,
  argTypes: {
    disabled: { control: { type: 'radio', options: [false, true] } },
    label: { control: { type: 'text' } },
    error: { control: { type: 'text' } },
  },
} as Meta;

const Template: Story<ICheckboxProps> = args => {
  const [value, setValue] = useState<boolean>(false);
  return <Checkbox {...args} value={value} onChange={setValue} />;
};

export const Default = Template.bind({});

Default.args = {
  label: 'Accept Privacy Policy',
  disabled: false,
  error: '',
};
