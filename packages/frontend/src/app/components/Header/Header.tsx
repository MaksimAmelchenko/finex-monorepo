import React from 'react';
import clsx from 'clsx';

import { ArrowLeftIcon, PlusIcon, Trash01Icon } from '@finex/ui-kit';

import styles from './Header.module.scss';

export interface HeaderProps {
  title: string;
  startAdornment?: React.ReactNode;
  endAdornment?: React.ReactNode;
}

export function Header({
  title,
  startAdornment: StartAdornment,
  endAdornment: EndAdornment,
}: HeaderProps): JSX.Element {
  return (
    <header className={styles.root}>
      {StartAdornment}
      <div className={clsx(styles.root__title, !EndAdornment && styles.root__title_withoutEndAdornment)}>
        {title}
      </div>
      {EndAdornment}
    </header>
  );
}

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {}

export function BackButton({ onClick }: ButtonProps): JSX.Element {
  return (
    <button type="button" className={clsx(styles.button, styles.button_startAdornment)} onClick={onClick}>
      <ArrowLeftIcon />
    </button>
  );
}

export function AddButton({ onClick }: ButtonProps): JSX.Element {
  return (
    <button type="button" className={clsx(styles.button, styles.button_endAdornment)} onClick={onClick}>
      <PlusIcon />
    </button>
  );
}

export function DeleteButton({ onClick }: ButtonProps): JSX.Element {
  return (
    <button
      type="button"
      className={clsx(styles.button, styles.button_endAdornment, styles.button_delete)}
      onClick={onClick}
    >
      <Trash01Icon />
    </button>
  );
}
