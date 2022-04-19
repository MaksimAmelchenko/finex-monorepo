import React, { FC } from 'react';

import styles from './DialogLayout.module.scss';

export const DialogLayout: FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className={styles.root}>{children}</div>
);
