import React, { useCallback } from 'react';
import ReactSelect, { Props, StylesConfig } from 'react-select';
import clsx from 'clsx';
import { FilterOptionOption } from 'react-select/dist/declarations/src/filters';

import { ArrowForwardIcon } from '../icons';

import styles from './select.module.scss';

const selectStyles: StylesConfig<ISelectOption, any> = {
  container: provided => ({
    ...provided,
    width: '100%',
    minWidth: '30rem',
  }),

  control: (provided, { isFocused, selectProps }) => {
    const isError = Boolean((selectProps as any)['data-is-error']);
    return {
      ...provided,
      borderRadius: 3,
      paddingLeft: 4,
      height: 40,
      boxShadow: 'none',
      ...(isFocused
        ? {
            borderColor: '#0066bf',
            '&:hover': {
              borderColor: '#0066bf',
            },
          }
        : {
            borderColor: '#dbe1ed',
            '&:hover': {
              borderColor: '#949db1',
            },
          }),
      ...(isError && {
        borderColor: '#e43201',
        '&:hover': {
          borderColor: '#e43201',
        },
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
      borderRadius: 3,
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
    <div className={clsx(styles.root, isError && styles.root_error)}>
      <ReactSelect
        {...rest}
        data-is-popup={isPopup}
        data-is-error={isError}
        filterOption={filterOption}
        styles={selectStyles}
        components={{ IndicatorSeparator: null, DropdownIndicator, ...components }}
        noOptionsMessage={noOptionsMessage}
      />
      {label && <label className={styles.root__label}>{label}</label>}
      {message && <p className={styles.root__helperText}>{message}</p>}
    </div>
  );
}

function DropdownIndicator(): JSX.Element {
  return <ArrowForwardIcon className={styles.dropdownIndicator} />;
}
