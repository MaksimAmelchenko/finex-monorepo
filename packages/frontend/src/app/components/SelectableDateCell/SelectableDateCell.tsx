import React from 'react';
import clsx from 'clsx';

import { BaseCheckbox } from '@finex/ui-kit';
import { TDate } from '../../types';
import { formatDate } from '../../lib/core/i18n';

import styles from './SelectableDateCell.module.scss';

interface SelectableDateCellProps {
  date: TDate;
  markerColor?: string | null;
  isSelected: boolean;
  onSelect: (event: React.SyntheticEvent) => unknown;
  className?: string;
}
export function SelectableDateCell({
  date,
  markerColor,
  isSelected,
  onSelect,
  className,
}: SelectableDateCellProps): JSX.Element {
  return (
    <td className={clsx('min-width', className)}>
      <div className={clsx(styles.dateColumn)} onClick={onSelect}>
        <div className={clsx(styles.dateColumn__colorMark, markerColor)} />
        <BaseCheckbox value={isSelected}/>
        <div className={styles.dateColumn__dateContainer}>
          <div className={styles.dateColumn__date}>{formatDate(date)}</div>
        </div>
      </div>
    </td>
  );
}
