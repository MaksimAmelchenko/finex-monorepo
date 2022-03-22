import React from 'react';
import { Meta, Story } from '@storybook/react';

import { TreeTableGroupingCell, TreeTableRow, useTreeTable } from './tree-table';

export default {
  title: 'Components/TreeTable',
  component: TreeTableExample,
  argTypes: {},
} as Meta;

const data = [
  { path: ['1'], title: 'title10', c2: '11', c3: '13' },
  { path: ['1', '2'], title: 'title101', c2: '102', c3: '103' },
  { path: ['1', '2', '3'], title: 'title1001', c2: '1002', c3: '1003' },
  { path: ['2'], title: 'title20', c2: '21', c3: '23' },
  { path: ['2', '2'], title: 'title201', c2: '202', c3: '203' },
  { path: ['3'], title: 'title30', c2: '31', c3: '33' },
];

function TreeTableExample() {
  const { getRowProps, getGroupingCellToggleProps } = useTreeTable();

  return (
    <table>
      <tbody>
        {data.map(({ path, title, c2, c3 }) => {
          const { isLeaf, isExpanded, level, isVisible } = getRowProps(path);
          const { onClick } = getGroupingCellToggleProps(path);
          return (
            <TreeTableRow isVisible={isVisible} key={path.join(':')}>
              <TreeTableGroupingCell isLeaf={isLeaf} isExpanded={isExpanded} level={level} onClick={onClick}>
                {title}
              </TreeTableGroupingCell>
              <td>{c2}</td>
              <td>{c3}</td>
            </TreeTableRow>
          );
        })}
      </tbody>
    </table>
  );
}

const Template: Story = args => <TreeTableExample {...args} />;

export const Default = Template.bind({});
