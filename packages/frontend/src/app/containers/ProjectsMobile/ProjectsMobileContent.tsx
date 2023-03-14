import React, { useCallback, useEffect } from 'react';
import { observer } from 'mobx-react-lite';

import { BackButton, Header } from '../../components/Header/Header';
import { Project } from '../../stores/models/project';
import { ProjectCard } from './ProjectCard/ProjectCard';
import { ProjectsRepository } from '../../stores/projects-repository';
import { SideSheetBody } from '../../components/SideSheetMobile/SideSheetBody/SideSheetBody';
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
  const { projects } = projectsRepository;
  const isSelectMode = Boolean(onSelect);

  useEffect(() => {
    analytics.view({
      page_title: 'projects-mobile',
    });
  }, []);

  const handleClick = useCallback(
    (project: Project, event: React.MouseEvent<HTMLButtonElement>) => {
      if (isSelectMode) {
        onSelect?.(project);
      }
    },
    [isSelectMode, onSelect]
  );

  return (
    <>
      <Header title={t('Projects')} startAdornment={<BackButton onClick={onClose} />} />
      <SideSheetBody>
        {projects.map(project => {
          return <ProjectCard project={project} onClick={handleClick} key={project.id} />;
        })}
      </SideSheetBody>
    </>
  );
});

export default ProjectsMobileContent;
