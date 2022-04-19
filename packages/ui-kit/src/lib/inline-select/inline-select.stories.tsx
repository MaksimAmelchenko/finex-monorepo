import React, { FC, useState } from 'react';
import { Meta, Story } from '@storybook/react';

import { InlineSelect, InlineSelectProps, IOption } from './inline-select';

export default {
  title: 'Components/InlineSelect',
  component: InlineSelect,
} as Meta;

const Template: Story = () => {
  const [value, setValue] = useState<string>('1');

  const options: IOption[] = [
    { value: '1', title: 'Title1' },
    { value: '2', title: 'Title2' },
    { value: '3', title: 'Title3' },
    { value: '4', title: 'Title4' },
  ];

  const option = options.find(option => option.value === value);

  const handleOnSelect = (value: string) => {
    setValue(value);
  };

  return <InlineSelect label={option!.title} options={options} onSelect={handleOnSelect} />;
};

export const Default = Template.bind({});
