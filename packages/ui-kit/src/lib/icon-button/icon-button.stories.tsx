import React from 'react';
import { Story, Meta } from '@storybook/react';

import { SearchMdIcon } from '../icons';
import { IconButton, IconButtonProps } from './icon-button';

export default {
  title: 'Components/IconButton',
  component: IconButton,
  argTypes: {
    size: { options: ['small', 'medium'], control: { type: 'select' } },
    disabled: { options: [false, true], control: { type: 'radio' } },
    loading: { options: [false, true], control: { type: 'radio' } },
    href: { control: { type: 'text' } },
  },
} as Meta;

const Template: Story<IconButtonProps> = args => (
  <IconButton {...args}>
    <SearchMdIcon />
  </IconButton>
);

export const Default = Template.bind({});
Default.args = {
  color: 'blue',
  size: 'medium',
  disabled: false,
  loading: false,
};
