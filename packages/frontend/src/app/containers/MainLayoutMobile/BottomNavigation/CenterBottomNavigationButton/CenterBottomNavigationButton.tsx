import React from 'react';

import { default as plusCircleSvg } from './assets/plus-circle.svg';

import styles from './CenterBottomNavigationButton.module.scss';

interface CenterBottomNavigationButton {
  onClick: () => void;
}

export function CenterBottomNavigationButton({ onClick }: CenterBottomNavigationButton): JSX.Element {
  return (
    <button className={styles.root} type="button" onClick={onClick}>
      <div className={styles.root__icon}>
        <img src={plusCircleSvg} />
      </div>
    </button>
  );
}
