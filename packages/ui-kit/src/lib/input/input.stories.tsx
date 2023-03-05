import React, { FC } from 'react';
import { Meta, Story } from '@storybook/react';

import { Dropdown, Input, InputProps } from './input';
import { MagnifyingGlassIcon, CalendarIcon } from '../icons';

export default {
  title: 'Components/Input',
  component: Input,
  argTypes: {
    size: {
      options: ['md'],
      control: { type: 'select' },
    },
    error: { control: { type: 'text' } },
    placeholder: { control: { type: 'text' } },
    label: { control: { type: 'text' } },
    helperText: { control: { type: 'text' } },
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
  },
} as Meta;

const Template: Story<InputProps> = args => {
  const [value, setValue] = React.useState('');
  const handleOnChange = React.useCallback((e: React.ChangeEvent<HTMLInputElement>) => setValue(e.target.value), []);

  return (
    <Input
      {...args}
      value={value}
      errorText={value.length > 5 ? 'Error' : ''}
      onChange={handleOnChange}
      // startAdornment={<Dropdown onClick={() => {}} />}
      // endAdornment={<Dropdown onClick={() => {}} />}
    />
  );
};

export const Default = Template.bind({});
Default.args = {
  size: 'sm',
  label: 'Label',
  placeholder: 'Placeholder',
  // endAdornment: 'MagnifyingGlassIcon' as any,
  errorText: 'Error',
  helperText: 'Helper Text',
};
