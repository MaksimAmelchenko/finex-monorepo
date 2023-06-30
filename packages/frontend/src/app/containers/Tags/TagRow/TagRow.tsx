import React from 'react';
import clsx from 'clsx';
import { observer } from 'mobx-react-lite';

import { BaseCheckbox, Button } from '@finex/ui-kit';
import { Tag } from '../../../stores/models/tag';
import { getT } from '../../../lib/core/i18n';

import styles from './TagRow.module.scss';

const t = getT('Tags');

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
      <td>
        <div className={styles.root__actionsButtons}>
          <Button variant="linkGray" size="md" href={`/transactions?tags=${tag.id}`}>
            {t('Transactions')}
          </Button>
        </div>
      </td>
    </tr>
  );
});
