import React, { FC, useState } from 'react';
import { Meta, Story } from '@storybook/react';

import { Select, SelectProps, ISelectOption } from './select';

import { ActionMeta, OnChangeValue } from 'react-select/dist/declarations/src/types';

export default {
  title: 'Components/Select',
  component: Select,
  argTypes: {
    placeholder: { control: { type: 'text' } },
    label: { control: { type: 'text' } },
    helperText: { control: { type: 'text' } },
    error: { control: { type: 'text' } },
  },
} as Meta;

const options: ISelectOption[] = [
  { value: '1', label: 'Label' },
  { value: '2', label: 'Title2' },
  { value: '3', label: 'Title3' },
  { value: '4', label: 'Title4' },
];

const Template: Story<SelectProps<true>> = props => {
  const [value, setValue] = useState<readonly ISelectOption[] | null>(null);

  const handleOnSelect = (value: OnChangeValue<ISelectOption, true>, actionMeta: ActionMeta<ISelectOption>) => {
    setValue(value);
  };

  return (
    <div
      style={{
        display: 'inline-block',
        width: '100%',
      }}
    >
      <Select {...props} value={value} options={options} onChange={handleOnSelect} />
      <button onClick={() => setValue(null)}>Reset select</button>
    </div>
  );
};

export const Default = Template.bind({});
Default.args = {
  label: 'Label',
};
