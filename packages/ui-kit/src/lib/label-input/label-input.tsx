import React, { useId } from 'react';
import clsx from 'clsx';

import { ChevronRightIcon } from '../icons';
import { IOption } from '../types';
import { Tag } from '../tag/tag';

import styles from './label-input.module.scss';

export interface LabelInputProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onClick'> {
  label?: string;
  options: IOption[];
  helperText?: string;
  size?: 'sm';
  onTagClick: (option: IOption) => void;
  onClick: (event: React.MouseEvent<HTMLDivElement>) => void;
  className?: string;
}

export function LabelInput(props: LabelInputProps): JSX.Element {
  const { options, label, size = 'sm', placeholder, helperText, className, onTagClick, onClick, ...rest } = props;
  const id = useId();

  const handleTagClick = (option: IOption, event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    onTagClick(option);
  };

  return (
    <div className={clsx(styles.root, className)} {...rest}>
      {label && (
        <label className={styles.root__label} htmlFor={id}>
          {label}
        </label>
      )}
      <div className={clsx(styles.root__input, styles.input)} onClick={onClick}>
        <div className={clsx(styles.input__content)}>
          {!options.length
            ? placeholder && <div className={styles.input__placeholder}>{placeholder}</div>
            : options.map(option => {
                const { value, label } = option;
                return (
                  <Tag size="lg" outline={false} onClose={event => handleTagClick(option, event)} key={value}>
                    {label}
                  </Tag>
                );
              })}
        </div>
        <button type="button" className={styles.dropdown}>
          <ChevronRightIcon className={styles.dropdown__arrow} />
        </button>
      </div>
      {helperText && <p className={styles.root__helperText}>{helperText}</p>}
    </div>
  );
}
