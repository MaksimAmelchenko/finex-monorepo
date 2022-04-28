import React from 'react';
import { Story, Meta } from '@storybook/react';

import { CashFlowIcon } from '../icons';
import { IconButton, IconButtonProps } from './icon-button';

export default {
  title: 'Components/IconButton',
  component: IconButton,
  argTypes: {
    size: { control: { type: 'select', options: ['small', 'medium'] } },
    disabled: { control: { type: 'radio', options: [false, true] } },
    loading: { control: { type: 'radio', options: [false, true] } },
    href: { control: { type: 'text' } },
  },
} as Meta;

const Template: Story<IconButtonProps> = args => (
  <IconButton {...args}>
    <CashFlowIcon />
  </IconButton>
);

export const Default = Template.bind({});
Default.args = {
  color: 'blue',
  size: 'medium',
  disabled: false,
  loading: false,
};
