import React from 'react';
import { Meta, Story } from '@storybook/react';

import { TextAreaFieldProps, TextAreaField } from './text-area-field';

export default {
  title: 'Components/TextAreaField',
  component: TextAreaField,
  argTypes: {
    error: { control: { type: 'text' } },
    placeholder: { control: { type: 'text' } },
    label: { control: { type: 'text' } },
    helperText: { control: { type: 'text' } },
  },
} as Meta;

const Template: Story<TextAreaFieldProps> = args => {
  const [value, setValue] = React.useState('');
  const handleOnChange = React.useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => setValue(e.target.value), []);

  return <TextAreaField {...args} value={value} error={value.length > 5 ? 'Error' : ''} onChange={handleOnChange} />;
};

export const Default = Template.bind({});
Default.args = {
  label: 'Note',
  error: 'Error',
  helperText: 'Helper Text',
};
