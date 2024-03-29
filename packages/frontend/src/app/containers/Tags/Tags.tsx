import React, { useState } from 'react';
import clsx from 'clsx';
import { observer } from 'mobx-react-lite';
import { useSnackbar } from 'notistack';

import { Button, PlusIcon, RefreshCW01Icon, Tag01Icon } from '@finex/ui-kit';
import { Drawer } from '../../components/Drawer/Drawer';
import { EmptyState } from '../../components/EmptyState/EmptyState';
import { ITag } from '../../types/tag';
import { Tag as TagModel } from '../../stores/models/tag';
import { TagRow } from './TagRow/TagRow';
import { TagWindow } from '../TagWindow/TagWindow';
import { TagsRepository } from '../../stores/tags-repository';
import { TrashIcon } from '../../components/TrashIcon/TrashIcon';
import { getT } from '../../lib/core/i18n';
import { useStore } from '../../core/hooks/use-store';

import styles from './Tags.module.scss';

const t = getT('Tags');

export const Tags = observer(() => {
  const tagsRepository = useStore(TagsRepository);
  const { tags } = tagsRepository;
  const { enqueueSnackbar } = useSnackbar();

  const [isOpenedTagWindow, setIsOpenedTagWindow] = useState<boolean>(false);
  const [tag, setTag] = useState<Partial<ITag> | TagModel | null>(null);

  const handleAddClick = () => {
    setTag({});
    setIsOpenedTagWindow(true);
  };

  const selectedTags = tags.filter(({ isSelected }) => isSelected);

  const handleDeleteClick = () => {
    if (selectedTags.length > 1) {
      if (!window.confirm(t('Are you sure you want to delete several tags?'))) {
        return;
      }
    }
    selectedTags.forEach(tag => {
      tagsRepository.deleteTag(tag).catch(err => {
        let message = '';
        switch (err.code) {
          default:
            message = err.message;
        }
        enqueueSnackbar(message, { variant: 'error' });
      });
    });
  };

  const handleRefreshClick = () => {
    tagsRepository.getTags();
  };

  const handleClickOnTag = (tag: TagModel) => {
    setTag(tag);
    setIsOpenedTagWindow(true);
  };

  const handleCloseTagWindow = () => {
    setIsOpenedTagWindow(false);
  };

  const isDeleteButtonDisabled = Boolean(!selectedTags.length);
  const isNoData = Boolean(!tags.length);

  return (
    <>
      <article className={styles.article}>
        <div className={clsx(styles.article__panel, styles.panel)}>
          <div className={clsx(styles.panel__toolbar, styles.toolbar)}>
            <div className={styles.toolbar__buttons}>
              <Button size="md" startIcon={<PlusIcon />} onClick={handleAddClick}>
                {t('New')}
              </Button>
              <Button
                variant="secondaryGray"
                size="md"
                startIcon={<TrashIcon disabled={isDeleteButtonDisabled} />}
                disabled={isDeleteButtonDisabled}
                onClick={handleDeleteClick}
              >
                {t('Delete')}
              </Button>
              <Button variant="secondaryGray" size="md" startIcon={<RefreshCW01Icon />} onClick={handleRefreshClick}>
                {t('Refresh')}
              </Button>
            </div>
          </div>
        </div>
        <div className={styles.tableWrapper}>
          {isNoData ? (
            <div className={styles.tableWrapper__emptyState}>
              <EmptyState
                illustration={<Tag01Icon className={styles.emptyState__illustration} />}
                text={t('You do not have tags yet')}
                supportingText={t('Start creating by clicking on\u00A0"Create\u00A0tag"')}
              >
                <Button size="lg" startIcon={<PlusIcon />} onClick={handleAddClick}>
                  {t('Create tag')}
                </Button>
              </EmptyState>
            </div>
          ) : (
            <table className={clsx('table table-hover table-sm')}>
              <thead>
                <tr>
                  <th />
                  <th>{t('Name')}</th>
                </tr>
              </thead>
              <tbody>
                {tags.map(tag => (
                  <TagRow tag={tag} onClick={handleClickOnTag} key={tag.id} />
                ))}
              </tbody>
            </table>
          )}
        </div>
      </article>

      <Drawer open={isOpenedTagWindow}>{tag && <TagWindow tag={tag} onClose={handleCloseTagWindow} />}</Drawer>
    </>
  );
});

export default Tags;
