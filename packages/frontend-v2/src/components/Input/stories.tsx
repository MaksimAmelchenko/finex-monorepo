/** @jsx h */
import { h } from 'preact';
import { Meta, Story } from '@storybook/preact';

import { Input, IInputProps } from './index';
// import { useState } from 'preact/hooks';

export default {
  title: 'Inputs/Input',
  component: Input,
  argTypes: { name: { control: false } },
} as Meta;

const Template: Story<IInputProps> = args => {
  // const [value, setValue] = useState<string>('');
  return (
    <Input
      {...args}
      // value={value}
      // onInput={e => {
      //   setValue(e.currentTarget.value);
      // }}
    />
  );
};

export const Default = Template.bind({});

Default.args = {
  label: 'E-mail',
};
