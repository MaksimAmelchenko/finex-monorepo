import React, { FunctionComponent, ReactNode, useCallback, useState } from 'react';
import { PropsValue } from 'react-select';
import { ActionMeta, OnChangeValue } from 'react-select/dist/declarations/src/types';

import { SearchMdIcon } from '../icons';
import { Select, ISelectOption, SelectProps } from '../select/select';

import styles from './select-popup.module.scss';

const components = { DropdownIndicator };

export interface SelectPopupProps<IsMulti extends boolean> extends Omit<SelectProps<IsMulti>, 'isPopup'> {
  target: FunctionComponent<{ value?: PropsValue<ISelectOption>; onClick: () => void }>;
  className?: string;
}

export function SelectPopup<IsMulti extends boolean = false>({
  target: Target,
  onChange,
  ...rest
}: SelectPopupProps<IsMulti>) {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const handleToggleOpen = useCallback(() => {
    setIsOpen(isOpen => !isOpen);
  }, []);

  const handleChange = useCallback(
    (value: OnChangeValue<ISelectOption, IsMulti>, actionMeta: ActionMeta<ISelectOption>) => {
      setIsOpen(false);
      onChange && onChange(value, actionMeta);
    },
    [onChange]
  );

  return (
    <Dropdown
      isOpen={isOpen}
      onClose={handleToggleOpen}
      target={<Target value={rest.value} onClick={handleToggleOpen} />}
    >
      <Select<IsMulti>
        autoFocus
        components={components}
        controlShouldRenderValue={false}
        hideSelectedOptions={true}
        isClearable={false}
        menuIsOpen
        onChange={handleChange}
        tabSelectsValue={false}
        isPopup
        {...rest}
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
      <SearchMdIcon className={styles.dropdownIndicator__icon} />
    </div>
  );
}
