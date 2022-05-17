import React, { FC } from 'react';
import clsx from 'clsx';

import styles from './FormFieldSet.module.scss';

interface FormFieldSetProps {
  legend?: string;
  className?: string;
  children: React.ReactNode;
}

export const FormFieldSet: FC<FormFieldSetProps> = ({ legend, className, children }) => {
  return (
    <fieldset className={clsx(styles.fieldset, className)}>
      {legend && <legend className={styles.legend}>{legend}</legend>}
      {children}
    </fieldset>
  );
};
