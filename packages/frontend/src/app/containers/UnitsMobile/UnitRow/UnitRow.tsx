import React from 'react';
import { observer } from 'mobx-react-lite';

import { Unit } from '../../../stores/models/unit';

import styles from './UnitRow.module.scss';

interface UnitRowProps {
  unit: Unit;
  onClick: (unit: Unit, event: React.MouseEvent<HTMLButtonElement>) => void;
}

export const UnitRow = observer<UnitRowProps>(({ unit, onClick }) => {
  const { name } = unit;

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    onClick(unit, event);
  };

  return (
    <button type="button" className={styles.root} onClick={handleClick}>
      <div className={styles.root__content}>
        <div className={styles.root__name}>{name}</div>
      </div>
    </button>
  );
});
