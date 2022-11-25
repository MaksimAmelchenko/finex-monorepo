import React from 'react';
import clsx from 'clsx';
import { observer } from 'mobx-react-lite';

import { BaseCheckbox } from '@finex/ui-kit';
import { Contractor } from '../../../stores/models/contractor';

interface ContractorProps {
  contractor: Contractor;
  onClick: (contractor: Contractor) => void;
}

export const ContractorRow = observer<ContractorProps>(({ contractor, onClick }: ContractorProps) => {
  const { name, note, isSelected, isDeleting } = contractor;

  const handleOnSelect = () => {
    contractor.toggleSelection();
  };

  const handleClick = (event: React.SyntheticEvent) => {
    onClick(contractor);
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
      <td>{note}</td>
    </tr>
  );
});
