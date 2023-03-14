import React from 'react';

import { ChevronRightIcon } from '@finex/ui-kit';

import styles from './MenuItem.module.scss';

export interface MenuItemProps {
  menuItemId: string;
  icon: React.ReactNode;
  text: string;
  expandButton?: boolean;
  onClick: (menuItemId: string) => void;
}

export function MenuItem({ menuItemId, icon, text, onClick, expandButton = true }: MenuItemProps): JSX.Element {
  const handleClick = () => {
    onClick(menuItemId);
  };

  return (
    <button type="button" className={styles.root} onClick={handleClick}>
      <div className={styles.root__icon}>{icon}</div>
      <div className={styles.root__text}>{text}</div>
      {expandButton && (
        <div className={styles.root__expandButton}>
          <ChevronRightIcon />
        </div>
      )}
    </button>
  );
}
