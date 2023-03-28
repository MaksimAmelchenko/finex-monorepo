import React from 'react';
import clsx from 'clsx';

import { IOption } from '../../types';

import styles from './segmented-control-button.module.scss';

export interface SegmentedControlButtonProps {
  option: IOption;
  isActive: boolean;
  size?: 'md';
  onClick: (option: IOption, event: React.MouseEvent<HTMLButtonElement>) => void;
}

export function SegmentedControlButton({
  option,
  isActive,
  size = 'md',
  onClick,
}: SegmentedControlButtonProps): JSX.Element {
  const { value, label } = option;

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    onClick(option, event);
  };
  return (
    <button
      type="button"
      className={clsx(styles.root, styles[`root_size_${size}`], isActive && styles.root_active)}
      onClick={handleClick}
    >
      <span className={styles.root__label}>{label}</span>
    </button>
  );
}
