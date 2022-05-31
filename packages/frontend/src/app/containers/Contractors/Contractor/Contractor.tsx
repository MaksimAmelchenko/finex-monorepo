import React from 'react';
import clsx from 'clsx';
import { observer } from 'mobx-react-lite';

import { Checkbox } from '@finex/ui-kit';
import { Contractor as ContractorModel } from '../../../stores/models/contractor';

import styles from './Contractor.module.scss';

interface ContractorProps {
  contractor: ContractorModel;
  onClick: (contractor: ContractorModel) => void;
}

export const Contractor = observer<ContractorProps>(({ contractor, onClick }: ContractorProps) => {
  const { name, note, isSelected, isDeleting } = contractor;

  const handleOnSelect = () => {
    contractor.toggleSelection();
  };

  const handleClick = (event: React.SyntheticEvent) => {
    event.stopPropagation();
    event.preventDefault();
    onClick(contractor);
  };

  return (
    <tr onClick={handleOnSelect} className={clsx(isDeleting && styles.row_is_deleting)}>
      <td className="min-width">
        <Checkbox value={isSelected} onChange={handleOnSelect} />
      </td>
      <td>
        <span className={styles.name} onClick={handleClick}>
          {name}
        </span>
      </td>
      <td>{note}</td>
    </tr>
  );
});
