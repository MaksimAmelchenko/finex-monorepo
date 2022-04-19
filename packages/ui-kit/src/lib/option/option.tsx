import React from 'react';

import styles from './option.module.scss';

export interface IOptionProps {
  label: string;
  onClick: (event: React.MouseEvent<HTMLSpanElement>) => void;
}

export function Option({ label, onClick }: IOptionProps): JSX.Element {
  return <span className={styles.option} onClick={onClick} dangerouslySetInnerHTML={{ __html: label }} />;
}
