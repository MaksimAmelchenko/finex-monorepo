import React from 'react';
import CircularProgress from '@mui/material/CircularProgress';

import styles from './circular-indeterminate.module.scss';

export function CircularIndeterminate(): JSX.Element {
  return (
    <div className={styles.container}>
      <CircularProgress />
    </div>
  );
}
