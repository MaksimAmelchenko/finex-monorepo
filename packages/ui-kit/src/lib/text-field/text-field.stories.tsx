import React from 'react';
import { Meta, Story } from '@storybook/react';

// import SearchIcon from '../Icons/SearchIcon.inline.svg';
import { ITextFieldProps, TextField } from './text-field';

const icons = {
  empty: '',
  // searchIcon: SearchIcon,
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
      // startAdornment={icons[args.startAdornment]}
    />
  );
};

export const Default = Template.bind({});
Default.args = {
  size: 'medium',
  label: 'Label',
  placeholder: 'Placeholder',
  startAdornment: 'searchIcon',
  error: 'Error',
  helperText: 'Helper Text',
};
