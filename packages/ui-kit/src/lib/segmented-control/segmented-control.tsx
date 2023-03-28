import React from 'react';
import clsx from 'clsx';

import { IOption } from '../types';
import { SegmentedControlButton } from './segmented-control-button/segmented-control-button';

import styles from './segmented-control.module.scss';

export interface SegmentedControlProps {
  value: string;
  options: IOption[];
  size?: 'md';
  onChange: (option: IOption) => void;
  className?: string;
}

export function SegmentedControl({
  value,
  options,
  size = 'md',
  onChange,
  className,
}: SegmentedControlProps): JSX.Element {
  const handleClick = (option: IOption, event: React.MouseEvent<HTMLButtonElement>) => {
    onChange(option);
  };

  return (
    <div className={clsx(styles.root, className, styles[`root_size_${size}`])}>
      {options.map(option => {
        const isActive = option.value === value;
        return <SegmentedControlButton option={option} isActive={isActive} onClick={handleClick} key={option.value} />;
      })}
    </div>
  );
}
