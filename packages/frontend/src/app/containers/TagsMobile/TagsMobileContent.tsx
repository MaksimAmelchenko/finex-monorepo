import React, { useCallback, useEffect, useState } from 'react';
import { observer } from 'mobx-react-lite';

import { AddButton, BackButton, Header } from '../../components/Header/Header';
import { Button, PlusIcon, Tag01Icon } from '@finex/ui-kit';
import { EmptyState } from '../../components/EmptyState/EmptyState';
import { ITag } from '../../types/tag';
import { SideSheetBody } from '../../components/SideSheetMobile/SideSheetBody/SideSheetBody';
import { SideSheetMobile } from '../../components/SideSheetMobile/SideSheetMobile';
import { Tag } from '../../stores/models/tag';
import { TagRow } from './TagRow/TagRow';
import { TagWindowMobile } from '../TagWindowMobile/TagWindowMobile';
import { TagsRepository } from '../../stores/tags-repository';
import { analytics } from '../../lib/analytics';
import { getT } from '../../lib/core/i18n';
import { useStore } from '../../core/hooks/use-store';

import styles from './TagsMobileContent.module.scss';

const t = getT('TagsMobile');

export interface TagsMobileContentProps {
  onSelect?: (tag: Tag) => void;
  onClose: () => void;
}

export const TagsMobileContent = observer<TagsMobileContentProps>(({ onSelect, onClose }) => {
  const tagsRepository = useStore(TagsRepository);
  const [tag, setTag] = useState<Partial<ITag> | Tag | null>(null);

  const { tags } = tagsRepository;
  const isSelectMode = Boolean(onSelect);

  useEffect(() => {
    analytics.view({
      page_title: 'tags-mobile',
    });
  }, []);

  const handleAddClick = useCallback(() => {
    setTag({});
  }, []);

  const handleClick = useCallback(
    (tag: Tag, event: React.MouseEvent<HTMLButtonElement>) => {
      if (isSelectMode) {
        onSelect?.(tag);
      } else {
        setTag(tag);
      }
    },
    [isSelectMode, onSelect]
  );

  function renderContent(): JSX.Element {
    if (!tags.length) {
      return (
        <div className={styles.root__emptyState}>
          <EmptyState
            illustration={<Tag01Icon className={styles.root__emptyStateIllustration} />}
            text={t('You do not have tags yet')}
            supportingText={t('Start creating by clicking on\u00A0"Create\u00A0tag"')}
          >
            <Button size="sm" startIcon={<PlusIcon />} onClick={handleAddClick}>
              {t('Create tag')}
            </Button>
          </EmptyState>
        </div>
      );
    }

    return (
      <>
        {tags.map(tag => (
          <TagRow tag={tag} onClick={handleClick} key={tag.id} />
        ))}
      </>
    );
  }

  return (
    <>
      <Header
        title={t('Tags')}
        startAdornment={<BackButton onClick={onClose} />}
        endAdornment={<AddButton onClick={handleAddClick} />}
      />
      <SideSheetBody>{renderContent()}</SideSheetBody>

      <SideSheetMobile open={Boolean(tag)}>
        {tag && <TagWindowMobile tag={tag} onClose={() => setTag(null)} />}
      </SideSheetMobile>
    </>
  );
});

export default TagsMobileContent;
