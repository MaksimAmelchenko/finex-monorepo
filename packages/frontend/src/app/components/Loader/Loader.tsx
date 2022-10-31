import React from 'react';

import { CircularIndeterminate } from '@finex/ui-kit';

import styles from './Loader.module.scss';

export function Loader(): JSX.Element {
  return (
    <div className={styles.loader}>
      <CircularIndeterminate />
    </div>
  );
}
