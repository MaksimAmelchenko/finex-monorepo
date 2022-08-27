import React from 'react';
import clsx from 'clsx';

import styles from './FormFooter.module.scss';

interface FormFooterProps {
  children: React.ReactNode;
  className?: string;
}

export const FormFooter: React.FC<FormFooterProps> = ({ children, className }): JSX.Element => {
  return <footer className={clsx(styles.footer, className)}>{children}</footer>;
};
