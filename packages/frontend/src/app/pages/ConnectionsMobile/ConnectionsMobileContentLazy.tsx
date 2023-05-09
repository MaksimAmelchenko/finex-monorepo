import React, { lazy } from 'react';

import { ConnectionsMobileContentProps } from './ConnectionsMobileContent';

const ConnectionsMobileContent = lazy(() => import(/* webpackChunkName: "connections-mobile" */ './ConnectionsMobileContent'));

export const ConnectionsMobileContentLazy = (props: ConnectionsMobileContentProps) => <ConnectionsMobileContent {...props} />;
