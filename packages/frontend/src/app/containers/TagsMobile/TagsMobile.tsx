import React, { useCallback } from 'react';
import { observer } from 'mobx-react-lite';

import { BackButton, Header } from '../../components/Header/Header';
import { Drawer } from '../../components/Drawer/Drawer';
import { Tag } from '../../stores/models/tag';
import { TagRow } from './TagRow/TagRow';
import { TagsRepository } from '../../stores/tags-repository';
import { getT } from '../../lib/core/i18n';
import { useStore } from '../../core/hooks/use-store';

import styles from './TagsMobile.module.scss';

const t = getT('TagsMobile');

interface TagsMobileProps {
  open: boolean;
  onSelect: (tag: Tag) => void;
  onClose: () => void;
}

export const TagsMobile = observer<TagsMobileProps>(({ open, onSelect, onClose }) => {
  const tagsRepository = useStore(TagsRepository);
  const { tags } = tagsRepository;
  const isSelectMode = Boolean(onSelect);

  const handleClick = useCallback(
    (tag: Tag, event: React.MouseEvent<HTMLButtonElement>) => {
      if (isSelectMode) {
        onSelect(tag);
      }
    },
    [isSelectMode, onSelect]
  );

  return (
    <Drawer open={open} className={styles.root}>
      <Header title={t('Tags')} startAdornment={<BackButton onClick={onClose} />} />
      <main className={styles.root__main}>
        {tags.map(tag => {
          return <TagRow tag={tag} onClick={handleClick} key={tag.id} />;
        })}
      </main>
    </Drawer>
  );
});
