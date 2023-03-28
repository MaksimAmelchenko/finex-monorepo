import React from 'react';
import clsx from 'clsx';

import styles from './SideSheetBody.module.scss';

export interface SideSheetMobileBodyProps {
  children: React.ReactNode;
  className?: string;
}

export function SideSheetBody({ children, className }: SideSheetMobileBodyProps): JSX.Element {
  return <main className={clsx(styles.root, className)}>{children}</main>;
}
