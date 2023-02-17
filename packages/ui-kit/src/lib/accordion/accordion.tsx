import React from 'react';
import clsx from 'clsx';

import styles from './accordion.module.scss';

export interface AccordionProps {
  isExpanded: boolean;
  children: React.ReactNode;
}

export function Accordion({ isExpanded, children }: AccordionProps): JSX.Element {
  return <div className={clsx(styles.root, isExpanded && styles.root_expanded)}>{children}</div>;
}
