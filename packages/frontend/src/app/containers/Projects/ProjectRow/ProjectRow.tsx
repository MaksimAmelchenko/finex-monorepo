import React from 'react';
import clsx from 'clsx';
import { observer } from 'mobx-react-lite';

import { Project } from '../../../stores/models/project';
import { Checkbox, Image, Tag, TickSvg } from '@finex/ui-kit';
import { Permit } from '../../../types';
import { getT } from '../../../lib/core/i18n';

import styles from './ProjectRow.module.scss';

const t = getT('Projects');

interface ProjectProps {
  project: Project;
  isSelected: boolean;
  onClick: (project: Project) => void;
  onRowClick: (project: Project) => void;
}

export const ProjectRow = observer<ProjectProps>(({ project, isSelected, onClick, onRowClick }: ProjectProps) => {
  const { permit, name, user, editors, note, isDeleting } = project;
  const isOwner = permit === Permit.Owner;

  const handleOnSelect = () => {
    onRowClick(project);
  };

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    event.stopPropagation();
    event.preventDefault();
    onClick(project);
  };

  return (
    <tr
      onClick={handleOnSelect}
      className={clsx(styles.row, {
        [styles.row_is_deleting]: isDeleting,
        [styles.row_selected]: isSelected,
      })}
    >
      <td>
        {isOwner ? (
          <span className={styles.row__name} onClick={handleClick}>
            {name}
          </span>
        ) : (
          name
        )}
      </td>
      <td>{isOwner ? t('Me') : user.name}</td>
      <td className={styles.tick}>{isOwner && editors.map(({ name, id }) => <Tag key={id}>{name}</Tag>)}</td>
      <td>{note}</td>
    </tr>
  );
});
