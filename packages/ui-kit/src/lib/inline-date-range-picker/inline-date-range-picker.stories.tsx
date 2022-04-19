import React, { useState } from 'react';
import { Meta, Story } from '@storybook/react';

import { InlineDateRangePicker, InlineDateRangePickerProps } from './inline-date-range-picker';

export default {
  title: 'Components/InlineDateRangePicker',
  component: InlineDateRangePicker,
} as Meta;

const Template: Story<InlineDateRangePickerProps> = () => {
  const [values, setValues] = useState<[Date, Date]>([new Date(), new Date()]);

  return (
    <InlineDateRangePicker
      labels={[values[0].toISOString(), values[1].toISOString()]}
      values={values}
      onChange={setValues}
      todayButton="Today"
    />
  );
};

export const Default = Template.bind({});
