import { Story, Meta } from '@storybook/react';
import { Profile } from './index';

export default {
  component: Profile,
  title: 'Profile',
} as Meta;

const Template: Story = args => <Profile {...args} />;

export const Primary = Template.bind({});
Primary.args = {};
