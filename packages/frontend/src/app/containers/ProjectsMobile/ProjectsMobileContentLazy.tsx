import React, { lazy } from 'react';

import { ProjectsMobileContentProps } from './ProjectsMobileContent';

const ProjectsMobileContent = lazy(() => import(/* webpackChunkName: "projects-mobile" */ './ProjectsMobileContent'));

export const ProjectsMobileContentLazy = (props: ProjectsMobileContentProps) => <ProjectsMobileContent {...props} />;
