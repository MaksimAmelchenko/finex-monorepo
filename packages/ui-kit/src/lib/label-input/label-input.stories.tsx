import React from 'react';
import { Meta, Story } from '@storybook/react';

import { Button2 } from '../button/button';
import { IOption } from '../types';
import { LabelInput, LabelInputProps } from './label-input';

export default {
  title: 'Components/LabelInput',
  component: LabelInput,
  argTypes: {
    size: {
      options: ['md'],
      control: { type: 'select' },
    },
    // error: { control: { type: 'text' } },
    // placeholder: { control: { type: 'text' } },
    label: { control: { type: 'text' } },
    helperText: { control: { type: 'text' } },
  },
} as Meta;

const Template: Story<LabelInputProps> = args => {
  const [options, setOptions] = React.useState<IOption[]>([{ value: '1', label: 'Label' }]);

  const handleClick = () => {
    setOptions([...options, { value: Math.random().toString(), label: `Label${Math.round(Math.random() * 100000)}` }]);
  };

  return (
    <>
      <LabelInput
        {...args}
        options={options}
        onClose={option => {
          setOptions(options.filter(({ value }) => value !== option.value));
        }}
        onClick={handleClick}
      />
      <br />
      <Button2 onClick={handleClick}>Add tag</Button2>
    </>
  );
};

export const Default = Template.bind({});
Default.args = {
  size: 'sm',
  label: 'Label',
  // placeholder: 'Placeholder',
  helperText: 'This is a hint text to help user.',
};
