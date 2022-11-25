import React from 'react';
import clsx from 'clsx';
import { observer } from 'mobx-react-lite';

import { BaseCheckbox } from '@finex/ui-kit';
import { Unit } from '../../../stores/models/unit';

interface UnitProps {
  unit: Unit;
  onClick: (unit: Unit) => void;
}

export const UnitRow = observer<UnitProps>(({ unit, onClick }: UnitProps) => {
  const { name, isSelected, isDeleting } = unit;

  const handleOnSelect = () => {
    unit.toggleSelection();
  };

  const handleClick = (event: React.SyntheticEvent) => {
    onClick(unit);
  };

  return (
    <tr className={clsx(isDeleting && 'is_deleting')}>
      <td className="checkboxCell" onClick={handleOnSelect}>
        <BaseCheckbox value={isSelected} />
      </td>
      <td>
        <span className="name" onClick={handleClick}>
          {name}
        </span>
      </td>
    </tr>
  );
});
