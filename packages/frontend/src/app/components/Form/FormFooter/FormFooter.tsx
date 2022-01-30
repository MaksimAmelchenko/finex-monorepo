import React, { FC } from 'react';

import { FormError } from '../FormError/FormError';
// <FormError / >
import styles from './FormFooter.module.scss';

export const FormFooter: FC = ({ children }): JSX.Element => {
  return (
    <footer className={styles.footer}>
      <FormError />
      <div className={styles.buttons}> {children} </div>
    </footer>
  );
};
