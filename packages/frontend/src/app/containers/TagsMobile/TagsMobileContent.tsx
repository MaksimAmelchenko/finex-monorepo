import React, { useCallback, useEffect } from 'react';
import { observer } from 'mobx-react-lite';

import { BackButton, Header } from '../../components/Header/Header';
import { SideSheetBody } from '../../components/SideSheetMobile/SideSheetBody/SideSheetBody';
import { Tag } from '../../stores/models/tag';
import { TagRow } from './TagRow/TagRow';
import { TagsRepository } from '../../stores/tags-repository';
import { getT } from '../../lib/core/i18n';
import { useStore } from '../../core/hooks/use-store';
import { analytics } from '../../lib/analytics';

const t = getT('TagsMobile');

export interface TagsMobileContentProps {
  onSelect?: (tag: Tag) => void;
  onClose: () => void;
}

export const TagsMobileContent = observer<TagsMobileContentProps>(({ onSelect, onClose }) => {
  const tagsRepository = useStore(TagsRepository);
  const { tags } = tagsRepository;
  const isSelectMode = Boolean(onSelect);

  useEffect(() => {
    analytics.view({
      page_title: 'tags-mobile',
    });
  }, []);

  const handleClick = useCallback(
    (tag: Tag, event: React.MouseEvent<HTMLButtonElement>) => {
      if (isSelectMode) {
        onSelect?.(tag);
      }
    },
    [isSelectMode, onSelect]
  );

  return (
    <>
      <Header title={t('Tags')} startAdornment={<BackButton onClick={onClose} />} />
      <SideSheetBody>
        {tags.map(tag => {
          return <TagRow tag={tag} onClick={handleClick} key={tag.id} />;
        })}
      </SideSheetBody>
    </>
  );
});

export default TagsMobileContent;
