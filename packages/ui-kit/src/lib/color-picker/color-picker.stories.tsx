import React, { useState } from 'react';
import { Meta, Story } from '@storybook/react';

import { ColorPicker, ColorPickerProps } from './color-picker';

export default {
  title: 'Components/ColorPicker',
  component: ColorPicker,
  argTypes: {},
} as Meta;

const Template: Story<ColorPickerProps> = args => {
  const [color, setColor] = useState<string | null>(null);

  return (
    <div style={{ width: '400px' }}>
      <ColorPicker {...args} value={color} onChange={setColor} />
    </div>
  );
};

export const Default = Template.bind({});
Default.args = {
  colors: [
    'bg-color-blue',
    'bg-color-blueLight',
    'bg-color-green',
    'bg-color-greenLight',
    'bg-color-yellow',
    'bg-color-orangeDark',
    'bg-color-pink',
    'bg-color-pinkDark',
    'bg-color-purple',
    'bg-color-magenta',
    'bg-color-redLight',
  ],
};
