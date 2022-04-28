import React from 'react';
import { Story, Meta } from '@storybook/react';

import { Button, IButtonProps } from './button';

export default {
  title: 'Components/Button',
  component: Button,
  argTypes: {
    color: { control: { type: 'select', options: ['primary', 'secondary'] } },
    size: { control: { type: 'select', options: ['small', 'medium', 'large'] } },
    disabled: { control: { type: 'radio', options: [false, true] } },
    loading: { control: { type: 'radio', options: [false, true] } },
    href: { control: { type: 'text' } },
    children: { control: { type: 'text' } },
  },
} as Meta;

const Template: Story<IButtonProps> = args => <Button {...args} />;

export const Default = Template.bind({});
Default.args = {
  color: 'primary',
  size: 'medium',
  disabled: false,
  loading: false,
  fullSize: false,
  href: '#',
  children: 'Button text',
};
