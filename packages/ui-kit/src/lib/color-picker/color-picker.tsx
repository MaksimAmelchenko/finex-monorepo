import React from 'react';
import clsx from 'clsx';

import { Image } from '../image/image';
import { TickSvg } from '../icons';

import styles from './color-picker.module.scss';

interface ItemProps {
  color: string;
  isActive: boolean;
  onClick: (color: string) => void;
}

function Item({ color, isActive, onClick }: ItemProps): JSX.Element {
  const handleOnClick = () => {
    onClick(color);
  };

  return (
    <div className={clsx(styles.item, color, color === '' && styles.item_empty)} onClick={handleOnClick}>
      {isActive && <Image src={TickSvg} alt="active" />}
    </div>
  );
}

export interface ColorPickerProps {
  value: string | null;
  colors: string[];
  onChange: (value: string) => void;
}

export function ColorPicker({ colors, onChange, value }: ColorPickerProps) {
  const handleItemClick = (color: string) => {
    onChange(color);
  };

  return (
    <div className={styles.container}>
      {colors.map(color => (
        <Item color={color} isActive={color === value} onClick={handleItemClick} key={color} />
      ))}
    </div>
  );
}
