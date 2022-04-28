import React, { Fragment } from 'react';
import clsx from 'clsx';
import { observer } from 'mobx-react-lite';

import { TreeBalance } from '../../../stores/balance-repository';
import { TreeTableGroupingCell, TreeTableRow, useTreeTable } from '@finex/ui-kit';
import { toCurrency } from '../../../lib/core/i18n';

import styles from './BalancesTable.module.scss';

interface IBalancesTableProps {
  treeBalance: TreeBalance;
}

export const BalancesTable = observer(({ treeBalance }: IBalancesTableProps) => {
  const { getRowProps, getGroupingCellToggleProps } = useTreeTable();

  return (
    <table className="table table-borderless table-sm">
      <tbody>
        {treeBalance.map(({ label, path, balances }, index) => {
          const { isLeaf, isExpanded, level, isVisible } = getRowProps(path);
          const { onClick } = getGroupingCellToggleProps(path);
          const key = path.join(':');
          return (
            <Fragment key={key}>
              {!isLeaf && (
                <>
                  <tr className={clsx(styles.row, styles.row_group, styles.row_delimiter)} key={`${key}:separator1`}>
                    <td colSpan={3} />
                  </tr>
                  <tr
                    className={clsx(
                      styles.row,
                      styles.row_group,
                      styles.row_delimiter,
                      styles.row_delimiter_with_border
                    )}
                    key={`${key}:separator2`}
                  >
                    <td colSpan={3} />
                  </tr>
                </>
              )}
              {balances.map(({ money, amount }, index) => (
                <TreeTableRow
                  isVisible={isVisible}
                  className={clsx(styles.row, !isLeaf && styles.row_group)}
                  key={`${key}:${money.id}`}
                >
                  {index === 0 && (
                    <TreeTableGroupingCell
                      isLeaf={isLeaf}
                      isExpanded={isExpanded}
                      level={level}
                      onClick={onClick}
                      rowSpan={balances.length}
                    >
                      {label}
                    </TreeTableGroupingCell>
                  )}
                  <td align="right" className={clsx('min-width numeric', styles.row__amount)}>
                    {toCurrency(amount, money.precision)}
                  </td>
                  <td
                    align="left"
                    className={clsx('min-width currency', styles.row__currency_symbol, styles.row__lastCell)}
                    dangerouslySetInnerHTML={{ __html: money.symbol }}
                  />
                </TreeTableRow>
              ))}
            </Fragment>
          );
        })}
      </tbody>
    </table>
  );
});
