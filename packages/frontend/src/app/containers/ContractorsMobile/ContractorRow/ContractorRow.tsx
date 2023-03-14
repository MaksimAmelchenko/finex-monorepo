import React from 'react';
import { observer } from 'mobx-react-lite';

import { Contractor } from '../../../stores/models/contractor';

import styles from './ContractorRow.module.scss';

interface ContractorRowProps {
  contractor: Contractor;
  onClick: (contractor: Contractor, event: React.MouseEvent<HTMLButtonElement>) => void;
}

export const ContractorRow = observer<ContractorRowProps>(({ contractor, onClick }) => {
  const { name } = contractor;

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    onClick(contractor, event);
  };

  return (
    <button type="button" className={styles.root} onClick={handleClick}>
      <div className={styles.root__content}>
        <div className={styles.root__name}>{name}</div>
      </div>
    </button>
  );
});
