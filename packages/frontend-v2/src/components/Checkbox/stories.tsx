import { h } from 'preact';
import { Meta, Story } from '@storybook/preact';
import { Checkbox, ICheckboxProps } from './index';

export default {
  title: 'Inputs/Checkbox',
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
