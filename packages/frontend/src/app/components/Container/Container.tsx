import React from 'react';
import clsx from 'clsx';

import styles from './Container.module.scss';

interface ContainerProps {
  className?: string;
  children: React.ReactNode;
}

export function Container({ className, children }: ContainerProps): JSX.Element {
  return <div className={clsx(styles.root, className)}> {children} </div>;
}
