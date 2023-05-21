import React, { useCallback } from 'react';
import ReactSelect, { Props, StylesConfig } from 'react-select';
import clsx from 'clsx';
import { FilterOptionOption } from 'react-select/dist/declarations/src/filters';

import { ChevronRightIcon } from '../icons';

import styles from './select.module.scss';

const selectStyles: StylesConfig<ISelectOption, any> = {
  container: provided => ({
    ...provided,
    width: '100%',
  }),

  multiValue: provided => {
    return {
      ...provided,
      borderRadius: 6,
      color: 'var(--color-primary-600)',
      backgroundColor: 'var(--color-primary-200)',
    };
  },

  multiValueLabel: provided => {
    return {
      ...provided,
      fontSize: 'inherit',
      color: 'var(--color-primary-700)',
      paddingLeft: '0.9rem',
      padding: '0.3rem 0.9rem',
    };
  },

  multiValueRemove: provided => {
    return {
      ...provided,
      padding: '0.6rem',
    };
  },

  control: (provided, { isFocused, selectProps }) => {
    const isError = Boolean((selectProps as any)['data-is-error']);
    return {
      ...provided,
      borderRadius: 8,
      paddingLeft: 4,
      minHeight: 40,
      // boxShadow: 'none',
      border: '1px solid var(--color-gray-300)',
      boxShadow: '0 1px 2px rgba(16, 24, 40, 0.05)',
      ...(isFocused && {
        border: '1px solid var(--color-primary-300)',
        boxShadow: '0 1px 2px rgba(16, 24, 40, 0.05), 0 0 0 4px var(--color-primary-100)',
      }),
      ...(isError && {
        border: '1px solid var(--color-error-300)',
        boxShadow: '0 1px 2px rgba(16, 24, 40, 0.05), 0 0 0 4px var(--color-primary-100)',
      }),
    };
  },
  menu: (provided, { selectProps }) => {
    const isPopup = Boolean((selectProps as any)['data-is-popup']);
    if (isPopup) {
      return {};
    }
    return {
      ...provided,
      borderRadius: 8,
    };
  },
};

export function isMulti(value: readonly ISelectOption[] | (ISelectOption | null)): value is readonly ISelectOption[] {
  return Array.isArray(value);
}

export interface ISelectOption {
  value: string;
  label: string;

  [key: string]: any;
}

function defaultMatcher(option: FilterOptionOption<ISelectOption>, input: string): boolean {
  // s = option.label.replace(/&rarr;/g, '').replace(/\s{2,}/g, ' ')
  // _.trim(s).toUpperCase().indexOf(input.toUpperCase()) >= 0
  return option.label.trim().toLowerCase().indexOf(input.trim().toLowerCase()) > -1;
}

export interface SelectProps<IsMulti extends boolean> extends Omit<Props<ISelectOption, IsMulti>, 'options'> {
  label?: string;
  options: ISelectOption[];
  noFoundMessage?: string;
  smallInputMessage?: string;
  placeholder?: string;
  minimumInputLength?: number;
  matcher?: (option: FilterOptionOption<ISelectOption>, input: string) => boolean;
  isPopup?: boolean;
  error?: string;
  helperText?: string;
  'data-cy'?: string;
}

export function Select<IsMulti extends boolean>(props: SelectProps<IsMulti>) {
  const {
    label,
    minimumInputLength = 2,
    noFoundMessage = 'No options',
    smallInputMessage = `Search input must be at least ${minimumInputLength} characters`,
    matcher = defaultMatcher,
    isPopup = false,
    error,
    helperText,
    className,
    ...rest
  } = props;
  const { options, components } = props;
  const isShowAllOptions = options.length < 300;
  const isError = Boolean(error);

  const message = isError ? error : helperText;

  const filterOption = useCallback(
    (option: FilterOptionOption<ISelectOption>, input: string): boolean => {
      return Boolean(
        (isShowAllOptions || (!isShowAllOptions && input.trim().length >= minimumInputLength)) && matcher(option, input)
      );
    },
    [isShowAllOptions, matcher, minimumInputLength]
  );

  const noOptionsMessage = useCallback(
    (input: any) => (input.inputValue.length >= minimumInputLength ? noFoundMessage : smallInputMessage),
    [minimumInputLength, noFoundMessage, smallInputMessage]
  );

  return (
    <div className={clsx(styles.root, isError && styles.root_error, className)} data-cy={rest['data-cy']}>
      {label && <label className={styles.root__label}>{label}</label>}
      <ReactSelect
        {...rest}
        data-is-popup={isPopup}
        data-is-error={isError}
        filterOption={filterOption}
        styles={selectStyles}
        components={{ IndicatorSeparator: null, DropdownIndicator, ...components }}
        noOptionsMessage={noOptionsMessage}
        // menuPortalTarget={document.querySelector('body')}
      />
      {message && <p className={styles.root__helperText}>{message}</p>}
    </div>
  );
}

function DropdownIndicator(): JSX.Element {
  return <ChevronRightIcon className={styles.dropdownIndicator} />;
}
