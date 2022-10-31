import React, { FC, HTMLAttributes, useRef, useState } from 'react';
import clsx from 'clsx';

import { chevronRightSvg } from '../icons';

import styles from './tree-table.module.scss';

function makeKey(path: string[]): string {
  return path.join(':');
}

export function useTreeTable() {
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});
  const amountChildren = useRef<{ isInitMap: Record<string, boolean> }>({ isInitMap: {} });
  const [childAmount, setChildAmount] = useState<Record<string, number>>({});
  // const childAmount = useRef<Record<string, number>>({});

  const onClick = (path: string[]) => () => {
    const key = makeKey(path);

    if ((childAmount[key] ?? 0) !== 0) {
      setExpanded(prevState => ({
        ...prevState,
        [key]: !prevState[key],
      }));
    }
  };

  const isVisible = (path: string[]): boolean => {
    let isVisible = true;
    for (let i = 0; i < path.length - 1; i++) {
      const key = makeKey(path.slice(0, i + 1));
      isVisible = isVisible && expanded[key];
      if (!isVisible) {
        return false;
      }
    }
    return isVisible;
  };

  const getRowProps = (path: string[]) => {
    const key = makeKey(path);
    if (!amountChildren.current.isInitMap[key]) {
      amountChildren.current.isInitMap[key] = true;
      for (let i = 0; i < path.length - 1; i++) {
        const key = makeKey(path.slice(0, i + 1));
        setChildAmount(prevState => ({
          ...prevState,
          [key]: (prevState[key] ?? 0) + 1,
        }));
        // childAmount.current[key] = key in childAmount.current ? childAmount.current[key] + 1 : 1;
      }
    }

    return {
      isVisible: isVisible(path),
      isLeaf: (childAmount[key] ?? 0) === 0,
      isExpanded: expanded[key] ?? false,
      level: path.length,
    };
  };

  const getGroupingCellToggleProps = (path: string[]) => {
    return {
      onClick: onClick(path),
    };
  };

  return {
    getRowProps,
    getGroupingCellToggleProps,
    childAmount,
  };
}

export interface TreeTableGroupingCellProps extends React.TdHTMLAttributes<HTMLTableDataCellElement> {
  isLeaf: boolean;
  isExpanded: boolean;
  level: number;
  onClick: () => unknown;
}

export const TreeTableGroupingCell: FC<TreeTableGroupingCellProps> = ({
  isLeaf,
  isExpanded,
  level,
  onClick,
  children,
  className,
  ...rest
}) => {
  return (
    <td {...rest} className={className}>
      <div className={clsx(styles.groupingCell)}>
        <div className={clsx(styles.indent)} style={{ ['--level' as any]: level }} onClick={onClick}>
          {!isLeaf && (
            <img
              src={chevronRightSvg}
              className={clsx(styles.indent__icon, isExpanded && styles.indent__icon_expanded)}
            />
          )}
        </div>
        <div className={styles.groupingCell__content}>{children}</div>
      </div>
    </td>
  );
};

export interface TreeTableRowProps extends React.HTMLAttributes<HTMLTableRowElement> {
  isVisible: boolean;
  className?: string;
  children: React.ReactNode;
}

export const TreeTableRow: FC<TreeTableRowProps> = ({ isVisible, className, children, ...rest }) => {
  return (
    <tr className={clsx(styles.row, isVisible && styles.row_visible, className)} {...rest}>
      {children}
    </tr>
  );
};
