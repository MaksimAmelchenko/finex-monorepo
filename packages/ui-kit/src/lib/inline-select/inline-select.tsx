import * as React from 'react';
import Menu from '@mui/material/Menu';
import MenuItemBase from '@mui/material/MenuItem';

import { IOption } from '../types';
import { Target } from '../target/target';

export interface InlineSelectProps {
  label: string;
  options: IOption[];
  onChange: (option: IOption) => void;
  className?: string;
}

interface OptionProps {
  option: IOption;
  onSelect: (option: IOption) => void;
}

function MenuItem({ option, onSelect }: OptionProps): JSX.Element {
  const handleClick = () => {
    onSelect(option);
  };
  return (
    <MenuItemBase onClick={handleClick}>
      <span dangerouslySetInnerHTML={{ __html: option.label }} />
    </MenuItemBase>
  );
}

export function InlineSelect({ label, options, onChange, className }: InlineSelectProps) {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const isOpen = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLSpanElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleSelect = (option: IOption) => {
    setAnchorEl(null);
    onChange(option);
  };

  return (
    <>
      <Target label={label} onClick={handleClick} className={className} />

      <Menu
        anchorEl={anchorEl}
        open={isOpen}
        onClose={handleClose}
        MenuListProps={{
          'aria-labelledby': 'basic-button',
        }}
      >
        {options.map(option => (
          <MenuItem option={option} onSelect={handleSelect} key={option.value} />
        ))}
      </Menu>
    </>
  );
}
