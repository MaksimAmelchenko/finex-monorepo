import React from 'react';
import { observer } from 'mobx-react-lite';

import { Project } from '../../../stores/models/project';

import styles from './ProjectCard.module.scss';

interface ProjectRowProps {
  project: Project;
  onClick: (project: Project, event: React.MouseEvent<HTMLButtonElement>) => void;
}

export const ProjectCard = observer<ProjectRowProps>(({ project, onClick }) => {
  const { name } = project;

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    onClick(project, event);
  };

  return (
    <button type="button" className={styles.root} onClick={handleClick}>
      <div className={styles.root__content}>
        <div className={styles.root__name}>{name}</div>
      </div>
    </button>
  );
});
