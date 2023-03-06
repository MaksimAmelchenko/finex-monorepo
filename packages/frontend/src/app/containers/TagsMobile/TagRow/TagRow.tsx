import React from 'react';
import { observer } from 'mobx-react-lite';

import { Tag } from '../../../stores/models/tag';

import styles from './TagRow.module.scss';

interface TagRowProps {
  tag: Tag;
  onClick: (tag: Tag, event: React.MouseEvent<HTMLButtonElement>) => void;
}

export const TagRow = observer<TagRowProps>(({ tag, onClick }) => {
  const { name } = tag;

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    onClick(tag, event);
  };

  return (
    <button type="button" className={styles.root} onClick={handleClick}>
      <div className={styles.root__content}>
        <div className={styles.root__name}>{name}</div>
      </div>
    </button>
  );
});
