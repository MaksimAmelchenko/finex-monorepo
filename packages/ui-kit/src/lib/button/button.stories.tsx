import React from 'react';
import { Meta, Story } from '@storybook/react';

import { Button, ButtonProps } from './button';
import { CalendarIcon, MagnifyingGlassIcon } from '../icons';

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
      options: ['Empty', 'MagnifyingGlassIcon', 'CalendarIcon'],
      mapping: {
        Empty: undefined,
        MagnifyingGlassIcon: <MagnifyingGlassIcon />,
        CalendarIcon: <CalendarIcon />,
      },
      control: {
        type: 'select',
        labels: {
          Empty: 'Empty',
          MagnifyingGlassIcon: 'MagnifyingGlass',
          CalendarIcon: 'Calendar',
        },
      },
    },
    endIcon: {
      options: ['Empty', 'MagnifyingGlassIcon', 'CalendarIcon'],
      mapping: {
        Empty: undefined,
        MagnifyingGlassIcon: <MagnifyingGlassIcon />,
        CalendarIcon: <CalendarIcon />,
      },
      control: {
        type: 'select',
        labels: {
          Empty: 'Empty',
          MagnifyingGlassIcon: 'MagnifyingGlass',
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
