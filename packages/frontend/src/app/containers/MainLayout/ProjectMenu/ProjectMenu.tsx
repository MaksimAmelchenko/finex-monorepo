import React, { useState } from 'react';
import { observer } from 'mobx-react-lite';
import { useSnackbar } from 'notistack';

import Collapse from '@mui/material/Collapse';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';

import { Project } from '../../../stores/models/project';
import { ProjectsRepository } from '../../../stores/projects-repository';
import { briefcase02Svg } from '@finex/ui-kit';
import { useStore } from '../../../core/hooks/use-store';

export const ProjectMenu = observer(() => {
  const projectsRepository = useStore(ProjectsRepository);
  const { enqueueSnackbar } = useSnackbar();
  const [isOpenedProjects, setIsOpenedProjects] = useState(false);

  const handleCurrentProjectClick = () => {
    setIsOpenedProjects(isOpenedProjects => !isOpenedProjects);
  };

  const handleProjectClick = (project: Project) => () => {
    projectsRepository
      .useProject(project.id)
      .then(() => setIsOpenedProjects(false))
      .catch(err => {
        let message = '';
        switch (err.code) {
          default:
            message = err.message;
        }
        enqueueSnackbar(message, { variant: 'error' });
      });
  };
  const { currentProject, projects } = projectsRepository;

  if (!currentProject || projects.length === 1) {
    return null;
  }

  return (
    <>
      <ListItemButton onClick={handleCurrentProjectClick}>
        <ListItemIcon>
          <img src={briefcase02Svg} alt="" />
        </ListItemIcon>
        <ListItemText primary={currentProject.name} />
      </ListItemButton>

      <Collapse
        in={isOpenedProjects}
        timeout="auto"
        unmountOnExit
        sx={{
          flexShrink: 0,
        }}
      >
        <List component="div" disablePadding>
          {projects
            .filter(project => project !== currentProject)
            .map(project => (
              <ListItemButton onClick={handleProjectClick(project)} key={project.id}>
                <ListItemText primary={project.name} />
              </ListItemButton>
            ))}
        </List>
      </Collapse>
    </>
  );
});
