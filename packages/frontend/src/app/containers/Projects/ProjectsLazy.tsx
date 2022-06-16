import React, { lazy } from 'react';

const Projects = lazy(() => import(/* webpackChunkName: "projects" */ './Projects'));

export const ProjectsLazy = () => <Projects />;
