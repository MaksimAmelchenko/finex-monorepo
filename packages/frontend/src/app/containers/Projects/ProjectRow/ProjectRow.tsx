import React from 'react';
import clsx from 'clsx';
import { observer } from 'mobx-react-lite';

import { BaseCheckbox, Tag } from '@finex/ui-kit';
import { Permit } from '../../../types';
import { Project } from '../../../stores/models/project';
import { getT } from '../../../lib/core/i18n';

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
    onClick(project);
  };

  return (
    <tr className={clsx(isDeleting && 'is_deleting')}>
      <td className="checkboxCell" onClick={handleOnSelect}>
        <BaseCheckbox value={isSelected} />
      </td>

      <td>
        {isOwner ? (
          <span className="name" onClick={handleClick}>
            {name}
          </span>
        ) : (
          name
        )}
      </td>
      <td>{isOwner ? t('Me') : user.name}</td>
      <td>{isOwner && editors.map(({ name, id }) => <Tag key={id}>{name}</Tag>)}</td>
      <td>{note}</td>
    </tr>
  );
});
