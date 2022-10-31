import { Meta, Story } from '@storybook/react';
import { Checkbox, ICheckboxProps } from './checkbox';
import { useState } from 'react';

export default {
  title: 'Components/Checkbox',
  component: Checkbox,
  argTypes: {
    disabled: {
      options: [false, true],
      control: { type: 'radio' },
    },
    error: { control: { type: 'text' } },
  },
} as Meta;

const Template: Story<ICheckboxProps> = ({ value, indeterminate, children, ...props }) => {
  const [localValue, setValue] = useState<boolean>(value);

  return (
    <Checkbox {...props} value={localValue} onChange={setValue} indeterminate={indeterminate}>
      {children}
    </Checkbox>
  );
};

export const Default = Template.bind({});

Default.args = {
  children: 'Accept Privacy Policy',
  disabled: false,
  indeterminate: true,
  value: true,
  error: '',
};
