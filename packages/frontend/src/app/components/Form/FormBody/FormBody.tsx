import React from 'react';
import clsx from 'clsx';

import styles from './FormBody.module.scss';

interface FormBodyProps {
  children: React.ReactNode;
  className?: string;
}

export function FormBody({ children, className }: FormBodyProps): JSX.Element {
  return <main className={clsx(styles.root, className)}>{children}</main>;
}
