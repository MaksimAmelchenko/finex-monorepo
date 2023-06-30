import React, { useEffect, useState } from 'react';
import clsx from 'clsx';
import { observer } from 'mobx-react-lite';
import { useSnackbar } from 'notistack';

import { Button, Copy01Icon, GitMergeIcon, PlusIcon, RefreshCW01Icon } from '@finex/ui-kit';
import { Drawer } from '../../components/Drawer/Drawer';
import { IProject } from '../../types/project';
import { Project } from '../../stores/models/project';
import { ProjectCopyWindow } from '../ProjectCopyWindow/ProjectCopyWindow';
import { ProjectMergeWindow } from '../ProjectMergeWindow/ProjectMergeWindow';
import { ProjectRow } from './ProjectRow/ProjectRow';
import { ProjectWindow } from '../ProjectWindow/ProjectWindow';
import { ProjectsRepository } from '../../stores/projects-repository';
import { TrashIcon } from '../../components/TrashIcon/TrashIcon';
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

    if (!window.confirm(t('Are you sure you want to delete this project?'))) {
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
  }, [projectsRepository.projects, selectedProject]);

  const isSelectCurrentProject = projectsRepository.currentProject === selectedProject;
  const isDeleteButtonDisabled = Boolean(!selectedProject || isSelectCurrentProject);

  return (
    <>
      <article className={styles.article}>
        <div className={clsx(styles.article__panel, styles.panel)}>
          <div className={clsx(styles.panel__toolbar, styles.toolbar)}>
            <div className={styles.toolbar__buttons}>
              <Button size="md" startIcon={<PlusIcon />} onClick={handleAddClick}>
                {t('New project')}
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

              <Button variant="secondaryGray" size="md" startIcon={<Copy01Icon />} onClick={handleCopyClick}>
                {t('Copy')}
              </Button>

              <Button variant="secondaryGray" size="md" startIcon={<GitMergeIcon />} onClick={handleMergeClick}>
                {t('Merge')}
              </Button>
            </div>
          </div>
        </div>

        <div className={styles.tableWrapper}>
          <table className={clsx('table table-sm', styles.table)}>
            <thead>
              <tr>
                <th />
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
        </div>
      </article>

      <Drawer open={isOpenedProjectWindow}>
        {project && <ProjectWindow project={project} onClose={handleCloseProjectWindow} />}
      </Drawer>

      <Drawer open={isOpenedCopyProjectWindow}>
        <ProjectCopyWindow project={selectedProject} onClose={handleCloseCopyProjectWindow} />
      </Drawer>

      <Drawer open={isOpenedMergeProjectWindow}>
        <ProjectMergeWindow project={selectedProject} onClose={handleCloseMergeProjectWindow} />
      </Drawer>
    </>
  );
});

export default Projects;
