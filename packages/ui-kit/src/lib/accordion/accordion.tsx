import React from 'react';
import clsx from 'clsx';

import styles from './accordion.module.scss';

export interface AccordionProps {
  isExpanded: boolean;
  children: React.ReactNode;
  className?: string;
}

export function Accordion({ isExpanded, className, children }: AccordionProps): JSX.Element {
  return (
    <div className={clsx(styles.root, isExpanded && styles.root_expanded, className)}>{isExpanded && children}</div>
  );
}
