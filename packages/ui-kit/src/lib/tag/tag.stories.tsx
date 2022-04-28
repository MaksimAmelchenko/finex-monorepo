import { Meta, Story } from '@storybook/react';

import { Tag, TagProps } from './tag';

export default {
  title: 'Components/Tag',
  component: Tag,

  argTypes: {
    size: { control: { type: 'select', options: ['small', 'medium'] } },
    onClose: { action: 'closed' },
  },
} as Meta;

const Template: Story<TagProps> = args => <Tag {...args} />;

export const Default = Template.bind({});

Default.args = {
  children: 'label',
  size: 'small',
};
