import React, { useState } from 'react';
import { Meta, Story } from '@storybook/react';

import { InlineSelect } from './inline-select';
import { IOption } from '../types';

export default {
  title: 'Components/InlineSelect',
  component: InlineSelect,
} as Meta;

const options: IOption[] = [
  { value: 'null', label: '' },
  { value: '1', label: 'Title1' },
  { value: '2', label: 'Title2' },
  { value: '3', label: 'Title3' },
  { value: '4', label: 'Title4' },
];

const Template: Story = () => {
  const [option, setOption] = useState<IOption>(options[0]);

  const handleChange = (option: IOption) => {
    setOption(option);
  };

  return <InlineSelect label={option.label} options={options} onChange={handleChange} />;
};

export const Default = Template.bind({});
