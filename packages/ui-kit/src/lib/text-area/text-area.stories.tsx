import React, { useCallback, useState } from 'react';
import { Meta, Story } from '@storybook/react';

import { TextAreaProps, TextArea } from './text-area';

export default {
  title: 'Components/TextArea2',
  component: TextArea,
  argTypes: {
    label: { control: { type: 'text' } },
    placeholder: { control: { type: 'text' } },
    helperText: { control: { type: 'text' } },
    errorText: { control: { type: 'text' } },
  },
} as Meta;

const Template: Story<TextAreaProps> = args => {
  const [value, setValue] = useState(args.value);
  const handleOnChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => setValue(e.target.value), []);

  return (
    <TextArea {...args} value={value} errorText={value.length > 5 ? args.errorText : ''} onChange={handleOnChange} />
  );
};

export const Default = Template.bind({});
Default.args = {
  label: 'Note',
  value: '',
  helperText: 'Helper Text',
  placeholder: 'Enter a description',
  errorText: 'Error',
};
