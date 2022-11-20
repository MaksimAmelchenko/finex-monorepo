import React from 'react';
import clsx from 'clsx';
import { observer } from 'mobx-react-lite';

import { BaseCheckbox } from '@finex/ui-kit';
import { Tag } from '../../../stores/models/tag';

interface TagProps {
  tag: Tag;
  onClick: (tag: Tag) => void;
}

export const TagRow = observer<TagProps>(({ tag, onClick }: TagProps) => {
  const { name, isSelected, isDeleting } = tag;

  const handleOnSelect = () => {
    tag.toggleSelection();
  };

  const handleClick = (event: React.SyntheticEvent) => {
    onClick(tag);
  };

  return (
    <tr className={clsx(isDeleting && 'is_deleting')}>
      <td className="checkboxCell" onClick={handleOnSelect}>
        <BaseCheckbox value={isSelected} />
      </td>
      <td>
        <span className="name" onClick={handleClick}>
          {name}
        </span>
      </td>
    </tr>
  );
});
