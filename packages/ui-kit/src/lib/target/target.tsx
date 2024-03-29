import * as React from 'react';
import clsx from 'clsx';

import { ChevronRightIcon } from '../icons';
import { Option } from '../option/option';

import styles from './target.module.scss';

export interface TargetProps {
  label: string;
  onClick: (event: React.MouseEvent<HTMLElement>) => void;
  className?: string;
}

// eslint-disable-next-line @typescript-eslint/no-empty-function
const noop = () => {};

export function Target({ label, onClick, className, ...rest }: TargetProps): JSX.Element {
  return (
    <button className={clsx(styles.target, className)} onClick={onClick} type="button" {...rest}>
      <Option label={label} onClick={noop} />
      <ChevronRightIcon className={styles.target__icon} />
    </button>
  );
}
