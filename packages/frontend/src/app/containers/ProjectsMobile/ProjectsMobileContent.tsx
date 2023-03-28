import React, { useCallback, useEffect, useState } from 'react';
import { observer } from 'mobx-react-lite';

import { AddButton, BackButton, Header } from '../../components/Header/Header';
import { IProject } from '../../types/project';
import { Project } from '../../stores/models/project';
import { ProjectCard } from './ProjectCard/ProjectCard';
import { ProjectWindowMobile } from '../ProjectWindowMobile/ProjectWindowMobile';
import { ProjectsRepository } from '../../stores/projects-repository';
import { SideSheetBody } from '../../components/SideSheetMobile/SideSheetBody/SideSheetBody';
import { SideSheetMobile } from '../../components/SideSheetMobile/SideSheetMobile';
import { analytics } from '../../lib/analytics';
import { getT } from '../../lib/core/i18n';
import { useStore } from '../../core/hooks/use-store';

const t = getT('ProjectsMobile');

export interface ProjectsMobileContentProps {
  onSelect?: (project: Project) => void;
  onClose: () => void;
}

export const ProjectsMobileContent = observer<ProjectsMobileContentProps>(({ onSelect, onClose }) => {
  const projectsRepository = useStore(ProjectsRepository);
  const [project, setProject] = useState<Partial<IProject> | Project | null>(null);

  const { projects } = projectsRepository;
  const isSelectMode = Boolean(onSelect);

  useEffect(() => {
    analytics.view({
      page_title: 'projects-mobile',
    });
  }, []);

  const handleAddClick = useCallback(() => {
    setProject({});
  }, []);

  const handleClick = useCallback(
    (project: Project, event: React.MouseEvent<HTMLButtonElement>) => {
      if (isSelectMode) {
        onSelect?.(project);
      } else {
        setProject(project);
      }
    },
    [isSelectMode, onSelect]
  );

  return (
    <>
      <Header
        title={t('Projects')}
        startAdornment={<BackButton onClick={onClose} />}
        endAdornment={<AddButton onClick={handleAddClick} />}
      />
      <SideSheetBody>
        {projects.map(project => {
          return <ProjectCard project={project} onClick={handleClick} key={project.id} />;
        })}
      </SideSheetBody>

      <SideSheetMobile open={Boolean(project)}>
        {project && <ProjectWindowMobile project={project} onClose={() => setProject(null)} />}
      </SideSheetMobile>
    </>
  );
});

export default ProjectsMobileContent;
