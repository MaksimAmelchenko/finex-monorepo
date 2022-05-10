import React from 'react';

import styles from './option.module.scss';

export interface IOptionProps {
  label: string;
  onClick: (event: React.MouseEvent<HTMLSpanElement>) => void;
}

export function Option({ label, onClick }: IOptionProps): JSX.Element {
  return (
    <div className={styles.option}>
      <div className={styles.option__label} onClick={onClick} dangerouslySetInnerHTML={{ __html: label }} />
    </div>
  );
}
