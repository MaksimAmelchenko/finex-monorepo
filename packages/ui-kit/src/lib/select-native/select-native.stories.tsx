import React, { useState } from 'react';
import { Meta, Story } from '@storybook/react';

import { CalendarIcon, SearchMdIcon } from '../icons';
import { IOption } from '../types';
import { SelectNative, SelectNativeProps } from './select-native';

export default {
  title: 'Components/SelectNative',
  component: SelectNative,
  argTypes: {
    placeholder: { control: { type: 'text' } },
    label: { control: { type: 'text' } },
    helperText: { control: { type: 'text' } },
    error: { control: { type: 'text' } },
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
  },
} as Meta;

const options: IOption[] = [
  { value: '1', label: 'Title1' },
  { value: '2', label: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.' },
  { value: '3', label: 'Title3' },
  { value: '4', label: 'Title4' },
];

const Template: Story<SelectNativeProps> = props => {
  const [value, setValue] = useState<string>('');

  const handleOnSelect = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setValue(event.target.value);
  };

  return (
    <>
      <SelectNative {...props} value={value} options={options} onChange={handleOnSelect} />
      <br />
      <button onClick={() => setValue('')}>Reset select</button>
    </>
  );
};

export const Default = Template.bind({});
Default.args = {
  label: 'Label',
  placeholder: 'Select your option',
};
