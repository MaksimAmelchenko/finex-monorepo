import React from 'react';

import { ArrowForwardIcon, ISelectPopupOption, Option, SelectPopup, Tag } from '@finex/ui-kit';

import styles from './MultiSelect.module.scss';
import { Target } from '../Target/Target';

interface MultiSelectProps {
  label: string;
  values: ISelectPopupOption[];
  options: ISelectPopupOption[];
  onChange: (values: ISelectPopupOption[]) => void;
  noFoundMessage?: string;
  smallInputMessage?: string;
  minimumInputLength?: number;
}

export function MultiSelect({ label, values, options, onChange, ...rest }: MultiSelectProps) {
  const handleChange = (option: ISelectPopupOption) => {
    onChange([...values, option]);
  };

  const handleDelete = (id: string) => () => {
    onChange(values.filter(({ value }) => value !== id));
  };

  return (
    <div className={styles.container}>
      <SelectPopup
        target={({ onClick }) => <Target label={label} onClick={onClick} />}
        options={options}
        value={values}
        onChange={handleChange}
        {...rest}
      />

      <div className={styles.container__tags}>
        {values.map(({ value, label }) => (
          <Tag onClose={handleDelete(value)} className={styles.container__tag} key={value}>
            {label}
          </Tag>
        ))}
      </div>
    </div>
  );
}
