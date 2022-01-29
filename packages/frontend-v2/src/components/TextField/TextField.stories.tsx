/** @jsx h */
import { h } from 'preact';
import { Meta, Story } from '@storybook/preact';

import { TextField, ITextFieldProps } from './TextField';
import { useState } from 'preact/hooks';

export default {
  title: 'Inputs/TextField',
  component: TextField,
  argTypes: { name: { control: false } },
} as Meta;

const Template: Story<ITextFieldProps> = args => {
  const [value, setValue] = useState<string>('');
  return (
    <TextField
      {...args}
      value={value}
      onInput={e => {
        setValue(e.currentTarget.value);
      }}
    />
  );
};

export const Default = Template.bind({});

Default.args = {
  label: 'E-mail',
  placeholder: 'Enter the email',
  error: '',
};
