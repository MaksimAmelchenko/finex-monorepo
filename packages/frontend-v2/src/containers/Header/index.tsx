import { FunctionalComponent, h, JSX } from 'preact';
import { Link } from 'preact-router/match';
import { useCallback } from 'preact/hooks';
import { observer } from 'mobx-react-lite';

import { useStore } from '../../core/hooks/use-store';
import { ProjectsRepository } from '../../stores/projects-repository';

import style from './style.css';

export const Header: FunctionalComponent = observer(() => {
  const projectsRepository = useStore(ProjectsRepository);
  const { currentProject, projects } = useStore(ProjectsRepository);

  const selectProjectHandle = useCallback(
    ({ currentTarget }: JSX.TargetedEvent<HTMLSelectElement>) => {
      const projectId = currentTarget.options[currentTarget.selectedIndex].value;
      projectsRepository.useProject(projectId).catch(console.error);
    },
    [projectsRepository]
  );

  return (
    <header class={style.header}>
      <h1>Preact App</h1>
      <nav>
        <Link activeClassName={style.active} href="/">
          Home
        </Link>
        <Link activeClassName={style.active} href="/profile">
          Me
        </Link>
        <Link activeClassName={style.active} href="/404">
          John
        </Link>
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
