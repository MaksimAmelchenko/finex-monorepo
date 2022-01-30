import { Meta, Story } from '@storybook/react';
import { Checkbox, ICheckboxProps } from './checkbox';

export default {
  title: 'Components/Checkbox',
  component: Checkbox,
} as Meta;

const Template: Story<ICheckboxProps & { children: string }> = args => <Checkbox {...args}>{args.children}</Checkbox>;

export const Default = Template.bind({});

Default.args = {
  value: true,
  label: 'Accept Privacy Policy',
  disabled: false,
  error: '',
};
