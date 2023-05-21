import React, { FC } from 'react';
import { Meta, Story } from '@storybook/react';

import { ITextFieldProps, TextField } from './text-field';
import { SearchMdIcon } from '../icons/';

const icons: Record<string, FC<any>> = {
  SearchIcon: SearchMdIcon,
};

export default {
  title: 'Components/TextField',
  component: TextField,
  argTypes: {
    size: { options: ['small', 'medium'], control: { type: 'select' } },
    error: { control: { type: 'text' } },
    placeholder: { control: { type: 'text' } },
    label: { control: { type: 'text' } },
    helperText: { control: { type: 'text' } },
    startAdornment: { options: ['empty', 'SearchIcon'], control: { type: 'select' } },
  },
} as Meta;

const Template: Story<ITextFieldProps> = args => {
  const [value, setValue] = React.useState('');
  const handleOnChange = React.useCallback((e: React.ChangeEvent<HTMLInputElement>) => setValue(e.target.value), []);

  return (
    <TextField
      {...args}
      value={value}
      error={value.length > 5 ? 'Error' : ''}
      onChange={handleOnChange}
      startAdornment={icons[args.startAdornment as any]}
    />
  );
};

export const Default = Template.bind({});
Default.args = {
  size: 'medium',
  label: 'Label',
  // placeholder: 'Placeholder',
  startAdornment: 'SearchIcon' as any,
  error: 'Error',
  helperText: 'Helper Text',
};
