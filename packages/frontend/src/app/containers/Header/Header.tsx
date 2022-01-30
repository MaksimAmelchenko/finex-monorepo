import React, { FC, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { observer } from 'mobx-react-lite';

import { ProjectsRepository } from '../../stores/projects-repository';
import { useStore } from '../../core/hooks/use-store';

import './style.css';

export const Header: FC = observer(() => {
  const projectsRepository = useStore(ProjectsRepository);
  const { currentProject, projects } = useStore(ProjectsRepository);

  const selectProjectHandle = useCallback(
    ({ currentTarget }: any) => {
      const projectId = currentTarget.options[currentTarget.selectedIndex].value;
      projectsRepository.useProject(projectId).catch(console.error);
    },
    [projectsRepository]
  );

  return (
    <header className={'header'}>
      <h1>Preact App</h1>
      <nav>
        <Link to="/">Home</Link>
        <Link to="/profile">Me</Link>
        <Link to="/404">John</Link>
      </nav>

      <select onInput={selectProjectHandle}>
        {projects.map(({ id, name }) => {
          return (
            <option value={id} key={id} selected={id === currentProject?.id}>
              {name}
            </option>
          );
        })}
      </select>
    </header>
  );
});
