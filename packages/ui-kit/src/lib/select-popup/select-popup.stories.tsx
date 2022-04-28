import React, { FC, useState } from 'react';
import { Meta, Story } from '@storybook/react';

import { SelectPopup, ISelectPopupOption, SelectPopupProps } from './select-popup';

import { Option } from '../option/option';
import { Button } from '../button/button';

export default {
  title: 'Components/SelectPopup',
  component: SelectPopup,
  argTypes: {
    placeholder: { control: { type: 'text' } },
  },
} as Meta;

const options: ISelectPopupOption[] = [
  { value: '1', label: 'Title1' },
  { value: '2', label: 'Title2' },
  { value: '3', label: 'Title3' },
  { value: '4', label: 'Title4' },
];

const Template: Story<SelectPopupProps> = props => {
  const [value, setValue] = useState<ISelectPopupOption>(options[0]);

  const handleOnSelect = (value: ISelectPopupOption) => {
    setValue(value);
  };

  return <SelectPopup {...props} value={value} options={options} onChange={handleOnSelect} />;
};

export const Default = Template.bind({});
Default.args = {
  target: ({ value, onClick }) => <Option label={(value as ISelectPopupOption).label} onClick={onClick} />,
};

export const ButtonTarget = Template.bind({});
ButtonTarget.args = {
  target: ({ value, onClick }) => <Button onClick={onClick}>{(value as ISelectPopupOption).label}</Button>,
};
