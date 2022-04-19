import * as React from 'react';
import Menu from '@mui/material/Menu';
import MenuItemBase from '@mui/material/MenuItem';

import { Option } from '../option/option';

export interface IOption {
  value: string;
  title: string;
}

export interface InlineSelectProps {
  label: string;
  options: IOption[];
  onSelect: (value: string) => void;
}

interface OptionProps {
  value: string;
  title: string;
  onSelect: (value: string) => void;
}

function MenuItem({ value, title, onSelect }: OptionProps): JSX.Element {
  const handleClick = () => {
    onSelect(value);
  };
  return (
    <MenuItemBase onClick={handleClick}>
      <span dangerouslySetInnerHTML={{ __html: title }} />
    </MenuItemBase>
  );
}

export function InlineSelect({ label, options, onSelect }: InlineSelectProps) {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const isOpen = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLSpanElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleSelect = (value: string) => {
    setAnchorEl(null);
    onSelect(value);
  };

  return (
    <>
      <Option label={label} onClick={handleClick} />

      <Menu
        anchorEl={anchorEl}
        open={isOpen}
        onClose={handleClose}
        MenuListProps={{
          'aria-labelledby': 'basic-button',
        }}
      >
        {options.map(({ value, title }) => (
          <MenuItem value={value} title={title} onSelect={handleSelect} key={value} />
        ))}
      </Menu>
    </>
  );
}
