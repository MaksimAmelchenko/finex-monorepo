import React from 'react';
import { OnChangeValue } from 'react-select/dist/declarations/src/types';

import { ISelectOption, SelectPopup, Tag, Target } from '@finex/ui-kit';

import styles from './MultiSelect.module.scss';

interface MultiSelectProps {
  label: string;
  values: ISelectOption[];
  options: ISelectOption[];
  onChange: (values: ISelectOption[]) => void;
  noFoundMessage?: string;
  smallInputMessage?: string;
  minimumInputLength?: number;
  className?: string;
}

export function MultiSelect({ label, values, options, onChange, ...rest }: MultiSelectProps) {
  const handleChange = (option: OnChangeValue<ISelectOption, false>) => {
    if (option) {
      onChange([...values, option]);
    }
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
