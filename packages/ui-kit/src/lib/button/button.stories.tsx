import React from 'react';
import { Meta, Story } from '@storybook/react';

import { Button, ButtonProps } from './button';
import { CalendarIcon, SearchMdIcon } from '../icons';

export default {
  title: 'Components/Button',
  component: Button,
  argTypes: {
    variant: {
      options: ['primary', 'secondary', 'secondaryGray'],
      control: { type: 'select' },
    },
    size: { options: ['sm', 'md', 'lg', 'xl'], control: { type: 'select' } },
    startIcon: {
      options: ['Empty', 'SearchIcon', 'CalendarIcon'],
      mapping: {
        Empty: undefined,
        SearchIcon: <SearchMdIcon />,
        CalendarIcon: <CalendarIcon />,
      },
      control: {
        type: 'select',
        labels: {
          Empty: 'Empty',
          SearchIcon: 'SearchIcon',
          CalendarIcon: 'Calendar',
        },
      },
    },
    endIcon: {
      options: ['Empty', 'SearchIcon', 'CalendarIcon'],
      mapping: {
        Empty: undefined,
        SearchIcon: <SearchMdIcon />,
        CalendarIcon: <CalendarIcon />,
      },
      control: {
        type: 'select',
        labels: {
          Empty: 'Empty',
          SearchIcon: 'SearchMdIcon',
          CalendarIcon: 'Calendar',
        },
      },
    },

    disabled: { options: [false, true], control: { type: 'radio' } },
    loading: { options: [false, true], control: { type: 'radio' } },
    href: { control: { type: 'text' } },
    children: { control: { type: 'text' } },
  },
} as Meta;

const Template: Story<ButtonProps> = args => <Button {...args} />;

export const Default = Template.bind({});
Default.args = {
  size: 'md',
  variant: 'primary',
  // startIcon: <CalendarIcon />,
  disabled: false,
  destructive: false,
  loading: false,
  fullSize: false,
  href: '#',
  children: '20 July, 2020',
};
