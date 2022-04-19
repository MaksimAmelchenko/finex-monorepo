import { Meta, Story } from '@storybook/react';
import { Option, IOptionProps } from './option';

export default {
  title: 'Components/Option',
  component: Option,
} as Meta;

const Template: Story<IOptionProps> = args => <Option {...args} />;

export const Default = Template.bind({});

Default.args = {
  label: 'Label',
};
