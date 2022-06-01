import React from 'react';
import clsx from 'clsx';
import { observer } from 'mobx-react-lite';

import { Checkbox } from '@finex/ui-kit';
import { Tag as TagModel } from '../../../stores/models/tag';

import styles from './TagRow.module.scss';

interface TagProps {
  tag: TagModel;
  onClick: (tag: TagModel) => void;
}

export const TagRow = observer<TagProps>(({ tag, onClick }: TagProps) => {
  const { name, isSelected, isDeleting } = tag;

  const handleOnSelect = () => {
    tag.toggleSelection();
  };

  const handleClick = (event: React.SyntheticEvent) => {
    event.stopPropagation();
    event.preventDefault();
    onClick(tag);
  };

  return (
    <tr onClick={handleOnSelect} className={clsx(isDeleting && styles.row_is_deleting)}>
      <td className="min-width">
        <Checkbox value={isSelected} onChange={handleOnSelect} />
      </td>
      <td>
        <span className={styles.name} onClick={handleClick}>
          {name}
        </span>
      </td>
    </tr>
  );
});
