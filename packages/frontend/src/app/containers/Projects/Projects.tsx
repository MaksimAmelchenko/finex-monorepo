import React, { useEffect, useState } from 'react';
import clsx from 'clsx';
import { observer } from 'mobx-react-lite';
import { useSnackbar } from 'notistack';

import { Button } from '@finex/ui-kit';
import { IProject } from '../../types/project';
import { Project } from '../../stores/models/project';
import { ProjectCopyWindow } from '../ProjectCopyWindow/ProjectCopyWindow';
import { ProjectMergeWindow } from '../ProjectMergeWindow/ProjectMergeWindow';
import { ProjectRow } from './ProjectRow/ProjectRow';
import { ProjectWindow } from '../ProjectWindow/ProjectWindow';
import { ProjectsRepository } from '../../stores/projects-repository';
import { getT } from '../../lib/core/i18n';
import { useStore } from '../../core/hooks/use-store';

import styles from './Projects.module.scss';

const t = getT('Projects');

export const Projects = observer(() => {
  const projectsRepository = useStore(ProjectsRepository);

  const [isOpenedCopyProjectWindow, setIsOpenedCopyProjectWindow] = useState<boolean>(false);
  const [isOpenedMergeProjectWindow, setIsOpenedMergeProjectWindow] = useState<boolean>(false);
  const [isOpenedProjectWindow, setIsOpenedProjectWindow] = useState<boolean>(false);
  const [project, setProject] = useState<Partial<IProject> | Project | null>(null);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  const { enqueueSnackbar } = useSnackbar();

  const { projects } = projectsRepository;

  const handleAddClick = () => {
    setProject({});
    setIsOpenedProjectWindow(true);
  };

  const handleDeleteClick = () => {
    if (!selectedProject) {
      return;
    }

    if (!window.confirm(t('Are you sure you what to delete this project?'))) {
      return;
    }

    projectsRepository
      .deleteProject(selectedProject)
      .then(() => setSelectedProject(null))
      .catch(err => {
        let message = '';
        switch (err.code) {
          default:
            message = err.message;
        }
        enqueueSnackbar(message, { variant: 'error' });
      });
  };

  const handleRefreshClick = () => {
    projectsRepository.getProjects().catch(() => {
      enqueueSnackbar(t('Something went wrong, please try again'), { variant: 'error' });
    });
  };

  const handleCopyClick = () => {
    setIsOpenedCopyProjectWindow(true);
  };

  const handleMergeClick = () => {
    setIsOpenedMergeProjectWindow(true);
  };

  const handleClickOnProject = (project: Project) => {
    setProject(project);
    setIsOpenedProjectWindow(true);
  };

  const handleClickOnRow = (project: Project) => {
    setSelectedProject(project);
  };

  const handleCloseProjectWindow = () => {
    setIsOpenedProjectWindow(false);
  };

  const handleCloseCopyProjectWindow = () => {
    setIsOpenedCopyProjectWindow(false);
  };

  const handleCloseMergeProjectWindow = () => {
    setIsOpenedMergeProjectWindow(false);
  };

  // reset selected project
  useEffect(() => {
    if (selectedProject) {
      if (!projectsRepository.projects.includes(selectedProject)) {
        setSelectedProject(null);
      }
    }
  }, [projectsRepository.projects]);

  const isSelectCurrentProject = projectsRepository.currentProject === selectedProject;
  return (
    <>
      <article>
        <div className={styles.panel}>
          <div className={clsx(styles.panel__toolbar, styles.toolbar)}>
            <div className={styles.toolbar__buttons}>
              <Button variant="contained" size="small" color="secondary" onClick={handleAddClick}>
                {t('New project')}
              </Button>
              <Button
                variant="outlined"
                size="small"
                disabled={!Boolean(selectedProject) || isSelectCurrentProject}
                onClick={handleDeleteClick}
              >
                {t('Delete')}
              </Button>
              <Button variant="outlined" size="small" onClick={handleRefreshClick}>
                {t('Refresh')}
              </Button>

              <Button variant="outlined" size="small" onClick={handleCopyClick}>
                {t('Copy')}
              </Button>

              <Button variant="outlined" size="small" onClick={handleMergeClick}>
                {t('Merge')}
              </Button>
            </div>
          </div>
        </div>

        <table className={clsx('table table-sm', styles.table)}>
          <thead>
            <tr>
              <th>{t('Name')}</th>
              <th>{t('Owner')}</th>
              <th>{t('Permit')}</th>
              <th>{t('Note')}</th>
            </tr>
          </thead>
          <tbody>
            {projects.map(project => (
              <ProjectRow
                project={project}
                isSelected={selectedProject === project}
                onRowClick={handleClickOnRow}
                onClick={handleClickOnProject}
                key={project.id}
              />
            ))}
          </tbody>
        </table>
      </article>

      {project && (
        <ProjectWindow isOpened={isOpenedProjectWindow} project={project} onClose={handleCloseProjectWindow} />
      )}

      <ProjectCopyWindow
        isOpened={isOpenedCopyProjectWindow}
        project={selectedProject}
        onClose={handleCloseCopyProjectWindow}
      />

      <ProjectMergeWindow
        isOpened={isOpenedMergeProjectWindow}
        project={selectedProject}
        onClose={handleCloseMergeProjectWindow}
      />
    </>
  );
});

export default Projects;
