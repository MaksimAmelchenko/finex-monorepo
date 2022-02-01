import React, { FC } from 'react';
import clsx from 'clsx';

import styles from './FormLayout.module.scss';

export const FormLayout: FC<{ className?: string }> = ({ className, children }) => {
  return <div className={clsx(styles.formLayout, className)}>{children}</div>;
};
