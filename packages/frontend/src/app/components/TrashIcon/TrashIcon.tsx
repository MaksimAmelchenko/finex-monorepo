import React from 'react';
import clsx from 'clsx';

import { Trash01Icon } from '@finex/ui-kit';

import styles from './TrashIcon.module.scss';

interface TrashIconProps {
  disabled?: boolean;
}
export function TrashIcon({ disabled = false }: TrashIconProps): JSX.Element {
  return <Trash01Icon className={clsx(styles.root, !disabled && styles.root_notDisabled)} />;
}
