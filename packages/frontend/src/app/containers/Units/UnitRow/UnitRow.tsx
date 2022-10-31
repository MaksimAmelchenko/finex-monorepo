import React from 'react';
import clsx from 'clsx';
import { observer } from 'mobx-react-lite';

import { BaseCheckbox } from '@finex/ui-kit';
import { Unit as UnitModel } from '../../../stores/models/unit';

import styles from './UnitRow.module.scss';

interface UnitProps {
  unit: UnitModel;
  onClick: (unit: UnitModel) => void;
}

export const UnitRow = observer<UnitProps>(({ unit, onClick }: UnitProps) => {
  const { name, isSelected, isDeleting } = unit;

  const handleOnSelect = () => {
    unit.toggleSelection();
  };

  const handleClick = (event: React.SyntheticEvent) => {
    event.stopPropagation();
    event.preventDefault();
    onClick(unit);
  };

  return (
    <tr onClick={handleOnSelect} className={clsx(isDeleting && styles.row_is_deleting)}>
      <td className="min-width">
        <BaseCheckbox value={isSelected} />
      </td>
      <td>
        <span className={styles.name} onClick={handleClick}>
          {name}
        </span>
      </td>
    </tr>
  );
});
