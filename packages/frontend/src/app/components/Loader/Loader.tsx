import React from 'react';

import { CircularIndeterminate } from '../../../../../ui-kit/src';

import styles from './Loader.module.scss';

export function Loader(): JSX.Element {
  return (
    <div className={styles.loader}>
      <CircularIndeterminate />
    </div>
  );
}
