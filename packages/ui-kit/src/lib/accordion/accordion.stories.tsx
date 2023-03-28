import React from 'react';
import { Story, Meta } from '@storybook/react';

import { AccordionProps, Accordion } from './accordion';

export default { title: 'Components/Accordion', component: Accordion } as Meta;

const Template: Story<AccordionProps> = args => <Accordion {...args} />;

export const Default = Template.bind({});

Default.args = {
  isExpanded: true,
  children: (
    <div>
      <p>
        Lorem ipsum dolor sit amet, consectetur adipisicing elit. Velit delectus sapiente dicta eligendi quis minus
        nulla maxime illo reiciendis corporis repudiandae excepturi? Velit molestiae reprehenderit eligendi neque
        repellendus! Illum molestiae quam iusto doloribus culpa sint similique quaerat libero! Molestiae facilis quidem
        explicabo totam nostrum in voluptatum ipsam sequi officia error id rerum unde nisi neque!
      </p>

      <p>Paragraph 2</p>
      <p>Paragraph 3</p>
    </div>
  ),
};
