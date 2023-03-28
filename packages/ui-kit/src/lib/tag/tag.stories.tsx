import { Meta, Story } from '@storybook/react';

import { Tag, TagProps } from './tag';

export default {
  title: 'Components/Tag',
  component: Tag,

  argTypes: {
    size: { control: { type: 'select' }, options: ['md', 'lg'] },
    onClose: { action: 'closed' },
  },
} as Meta;

const Template: Story<TagProps> = args => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.6rem', alignItems: 'start' }}>
      <Tag {...args} color="primary" outline={false} />
      <Tag {...args} color="gray" outline={false} />

      <Tag {...args} color="primary" outline />
      <Tag {...args} color="gray" outline />
    </div>
  );
};

export const Default = Template.bind({});

Default.args = {
  children: 'label',
  size: 'md',
};
