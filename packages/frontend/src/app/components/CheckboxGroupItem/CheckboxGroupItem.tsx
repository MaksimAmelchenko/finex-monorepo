import React from 'react';
import clsx from 'clsx';

import { BaseCheckbox } from '@finex/ui-kit';

import styles from './CheckboxGroupItem.module.scss';

export interface CheckboxGroupItemProps {
  selected: boolean;
  title: string;
  description: string;
  onChange: (value: boolean) => void;
}

export function CheckboxGroupItem({
  selected,
  title,
  description,
  onChange,
}: CheckboxGroupItemProps): JSX.Element | null {
  const handleClick = () => {
    onChange(!selected);
  };

  return (
    <div className={clsx(styles.root, selected && styles.root_selected)} onClick={handleClick}>
      <div className={styles.root__content}>
        <div className={styles.root__textAndSupportingText}>
          <div className={styles.root__text}>{title}</div>
          <div className={styles.root__supportingText}>{description}</div>
        </div>
      </div>
      <BaseCheckbox value={selected} className={styles.root__checkbox} />
    </div>
  );
}
