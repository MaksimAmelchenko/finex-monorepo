import React from 'react';
import clsx from 'clsx';

import { CircularIndeterminate } from '@finex/ui-kit';

import styles from './Loader.module.scss';

interface LoaderProps {
  className?: string;
}
export function Loader({ className }: LoaderProps): JSX.Element {
  return (
    <div className={clsx(styles.root, className)}>
      <CircularIndeterminate />
    </div>
  );
}
