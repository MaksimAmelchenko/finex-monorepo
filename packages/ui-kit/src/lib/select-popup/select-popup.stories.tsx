import React, { FC, useState } from 'react';
import { Meta, Story } from '@storybook/react';

import { ISelectOption } from '../select/select';
import { SelectPopup, SelectPopupProps } from './select-popup';

import { Option } from '../option/option';
import { Button } from '../button/button';
import { OnChangeValue } from 'react-select/dist/declarations/src/types';

export default {
  title: 'Components/SelectPopup',
  component: SelectPopup,
  argTypes: {
    placeholder: { control: { type: 'text' } },
  },
} as Meta;

const options: ISelectOption[] = [
  { value: '1', label: 'Title1' },
  { value: '2', label: 'Title2' },
  { value: '3', label: 'Title3' },
  { value: '4', label: 'Title4' },
];

const Template: Story<SelectPopupProps<false>> = props => {
  const [value, setValue] = useState<ISelectOption>(options[0]);

  const handleOnSelect = (value: OnChangeValue<ISelectOption, false>) => {
    setValue(value!);
  };

  return <SelectPopup {...props} value={value} options={options} onChange={handleOnSelect} />;
};

export const Default = Template.bind({});
Default.args = {
  target: ({ value, onClick }) => <Option label={(value as ISelectOption).label} onClick={onClick} />,
};

export const ButtonTarget = Template.bind({});
ButtonTarget.args = {
  target: ({ value, onClick }) => <Button onClick={onClick}>{(value as ISelectOption).label}</Button>,
};
