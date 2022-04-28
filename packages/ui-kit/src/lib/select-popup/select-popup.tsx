import React, { FunctionComponent, ReactNode, useCallback, useState } from 'react';
import Select, { StylesConfig } from 'react-select';
import { FilterOptionOption } from 'react-select/dist/declarations/src/filters';

import { SearchIcon } from '../icons';

import styles from './select-popup.module.scss';

const selectStyles: StylesConfig<ISelectPopupOption, false> = {
  control: (provided, state) => {
    return {
      ...provided,
      borderRadius: 3,
      boxShadow: 'none',
      margin: 8,
      minWidth: 240,
      '&:hover': {
        borderColor: '#0066bf',
      },
    };
  },
  menu: () => ({
    boxShadow: 'inset 0 1px 0 rgba(0, 0, 0, 0.1)',
  }),
};

export interface ISelectPopupOption {
  value: string;
  label: string;

  [key: string]: any;
}

const components = { DropdownIndicator, IndicatorSeparator: null };

function defaultMatcher(option: FilterOptionOption<ISelectPopupOption>, input: string): boolean {
  // s = option.label.replace(/&rarr;/g, '').replace(/\s{2,}/g, ' ')
  // _.trim(s).toUpperCase().indexOf(input.toUpperCase()) >= 0
  return option.label.trim().toLowerCase().indexOf(input.trim().toLowerCase()) > -1;
}

export interface SelectPopupProps {
  target: FunctionComponent<{ value?: ISelectPopupOption | ISelectPopupOption[] | null; onClick: () => void }>;
  value?: ISelectPopupOption | ISelectPopupOption[] | null;
  options: ISelectPopupOption[];
  onChange: (value: ISelectPopupOption) => void;
  noFoundMessage?: string;
  smallInputMessage?: string;
  placeholder?: string;
  minimumInputLength?: number;
  matcher?: (option: FilterOptionOption<ISelectPopupOption>, input: string) => boolean;
}

export function SelectPopup({
  value,
  target: Target,
  options,
  onChange,
  minimumInputLength = 2,
  noFoundMessage = 'No options',
  smallInputMessage = `Search input must be at least ${minimumInputLength} characters`,
  placeholder,
  matcher = defaultMatcher,
}: SelectPopupProps) {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const handleToggleOpen = useCallback(() => {
    setIsOpen(isOpen => !isOpen);
  }, []);

  const handleChange = useCallback(
    (value: ISelectPopupOption | null) => {
      setIsOpen(false);
      onChange(value!);
    },
    [onChange]
  );

  const isShowAllOptions = options.length < 300;

  const filterOption = useCallback(
    (option: FilterOptionOption<ISelectPopupOption>, input: string): boolean => {
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
    <Dropdown isOpen={isOpen} onClose={handleToggleOpen} target={<Target value={value} onClick={handleToggleOpen} />}>
      <Select
        autoFocus
        filterOption={filterOption}
        // backspaceRemovesValue={false}
        components={components}
        controlShouldRenderValue={false}
        hideSelectedOptions={true}
        isClearable={false}
        menuIsOpen
        onChange={handleChange}
        options={options}
        placeholder={placeholder}
        styles={selectStyles}
        tabSelectsValue={false}
        noOptionsMessage={noOptionsMessage}
        value={value}
      />
    </Dropdown>
  );
}

interface DropdownProps {
  isOpen: boolean;
  target: ReactNode;
  onClose: () => void;
  children: ReactNode;
}

function Dropdown({ children, isOpen, target, onClose }: DropdownProps) {
  return (
    <div className={styles.dropdown}>
      {target}
      {isOpen && (
        <>
          <div className={styles.backdrop} onClick={onClose} />
          <div className={styles.menu}>{children}</div>
        </>
      )}
    </div>
  );
}

function DropdownIndicator(): JSX.Element {
  return (
    <div className={styles.dropdownIndicator}>
      <SearchIcon className={styles.dropdownIndicator__icon} />
    </div>
  );
}
