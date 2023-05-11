import React from 'react';

import { ChevronRightIcon } from '@finex/ui-kit';

import styles from './InstitutionCard.module.scss';

export interface InstitutionCardProps {
  id: string;
  logo: string;
  name: string;
  onClick: (institutionId: string) => void;
}

export function InstitutionCard({ id, logo, name, onClick }: InstitutionCardProps): JSX.Element {
  return (
    <button type="button" className={styles.root} onClick={() => onClick(id)}>
      <div className={styles.root__logo}>
        <img src={logo} alt={name} />
      </div>
      <div className={styles.root__name}>{name}</div>
      <div className={styles.root__expandButton}>
        <ChevronRightIcon />
      </div>
    </button>
  );
}
