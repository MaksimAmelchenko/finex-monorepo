import React from 'react';
import clsx from 'clsx';

import styles from './FormBody.module.scss';

interface FormBodyProps {
  children: React.ReactNode;
  className?: string;
}

export const FormBody: React.FC<FormBodyProps> = ({ children, className }): JSX.Element => {
  return <main className={clsx(styles.main, className)}>{children}</main>;
};
