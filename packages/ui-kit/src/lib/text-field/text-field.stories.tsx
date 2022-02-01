import React, { FC } from 'react';
import { Meta, Story } from '@storybook/react';

// eslint-disable-next-line @nrwl/nx/enforce-module-boundaries
import { ReactComponent as SearchIcon } from '../../../../frontend/src/app/icons/SearchIcon.svg';

import { ITextFieldProps, TextField } from './text-field';

console.log(SearchIcon);
const icons: Record<string, FC<any>> = {
  searchIcon: SearchIcon,
};

export default {
  title: 'Components/TextField',
  component: TextField,
  argTypes: {
    size: { control: { type: 'select', options: ['small', 'medium'] } },
    error: { control: { type: 'text' } },
    placeholder: { control: { type: 'text' } },
    label: { control: { type: 'text' } },
    helperText: { control: { type: 'text' } },
    startAdornment: { control: { type: 'select', options: ['empty', 'searchIcon'] } },
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
  startAdornment: 'searchIcon' as any,
  error: 'Error',
  helperText: 'Helper Text',
};
