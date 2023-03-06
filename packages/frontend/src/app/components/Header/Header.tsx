import React from 'react';
import clsx from 'clsx';

import { arrowLeftSvg, plusSvg } from '@finex/ui-kit';

import styles from './Header.module.scss';

export interface HeaderProps {
  onClickBack: () => void;
  title: string;
  onClickAdd?: () => void;
}

export function Header({ onClickBack, title, onClickAdd }: HeaderProps): JSX.Element {
  const isAddIcon = Boolean(onClickAdd);
  return (
    <header className={styles.root}>
      <button type="button" className={clsx(styles.root__button, styles.root__button_backButton)} onClick={onClickBack}>
        <img src={arrowLeftSvg} className={styles.root__backIcon} alt="back" />
      </button>
      <div className={clsx(styles.root__title, !isAddIcon && styles.root__title_withoutAddButton)}>{title}</div>
      {isAddIcon && (
        <button type="button" className={clsx(styles.root__button, styles.root__button_backAdd)} onClick={onClickAdd}>
          <img src={plusSvg} className={styles.root__backIcon} alt="add" />
        </button>
      )}
    </header>
  );
}
