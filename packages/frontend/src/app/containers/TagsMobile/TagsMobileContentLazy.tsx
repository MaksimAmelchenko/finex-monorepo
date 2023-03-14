import React, { lazy } from 'react';

import { TagsMobileContentProps } from './TagsMobileContent';

const TagsMobileContent = lazy(() => import(/* webpackChunkName: "tags-mobile" */ './TagsMobileContent'));

export const TagsMobileContentLazy = (props: TagsMobileContentProps) => <TagsMobileContent {...props} />;
