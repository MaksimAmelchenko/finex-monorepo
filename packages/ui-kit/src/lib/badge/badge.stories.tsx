import { Meta, Story } from '@storybook/react';

import { Badge, BadgeProps } from './badge';

export default {
  title: 'Components/Badge',
  component: Badge,

  argTypes: {
    size: { control: { type: 'select' }, options: ['small', 'medium'] },
    onClose: { action: 'closed' },
  },
} as Meta;

const Template: Story<BadgeProps> = args => <Badge {...args} />;

export const Default = Template.bind({});

Default.args = {
  children: 'label',
  size: 'md',
};
