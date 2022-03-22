import React, { useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import clsx from 'clsx';

import { BalanceRepository } from '../../../stores/balance-repository';
import { TreeTableGroupingCell, TreeTableRow, useTreeTable } from '@finex/ui-kit';
import { getT, toCurrency } from '../../../lib/core/i18n';
import { useStore } from '../../../core/hooks/use-store';

import styles from './AccountBalances.module.scss';

const t = getT('Dashboard');

export const AccountBalances = observer(() => {
  const balanceRepository = useStore(BalanceRepository);
  const { getRowProps, getGroupingCellToggleProps, childAmount } = useTreeTable();

  const { accountBalances, balancesLoadState } = balanceRepository;

  useEffect(() => {
    balanceRepository.fetchBalance().catch(console.error);
  }, [balanceRepository]);

  if (!balancesLoadState.isDone()) {
    return <div>Loading...</div>;
  }

  const treeBalance = true
    ? balanceRepository.treeBalance
    : balanceRepository.treeBalance
        .map(balance => ({
          ...balance,
          balances: balance.balances.filter(({ amount }) => amount !== 0),
        }))
        .filter(({ balances }) => balances.length);

  return (
    <div>
      <section className={clsx(styles.accountBalances)}>
        <table className={clsx('table table_condensed')}>
          <tbody>
            {balanceRepository.totalBalance.map(({ money, amount }, index, array) => (
              <tr className={clsx(styles.row, styles.row_total)} key={money.id}>
                {index === 0 && <td rowSpan={array.length}>{t('Total')}</td>}
                <td align="right" className="minWidth numeric">
                  {toCurrency(amount, money.precision)}
                </td>
                <td
                  align="left"
                  className={clsx('minWidth', styles.row__currency_symbol)}
                  dangerouslySetInnerHTML={{ __html: money.symbol }}
                />
              </tr>
            ))}
          </tbody>
        </table>
        <table className={clsx('table table_condensed')}>
          <tbody>
            {treeBalance.map(({ label, path, balances }, index) => {
              const { isLeaf, isExpanded, level, isVisible } = getRowProps(path);
              const { onClick } = getGroupingCellToggleProps(path);
              const key = path.join(':');
              return (
                <>
                  {!isLeaf && (
                    <>
                      <tr
                        className={clsx(styles.row, styles.row_group, styles.row_delimiter)}
                        key={`${key}:separator1`}
                      >
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
                      <td align="right" className={clsx('minWidth numeric', styles.row__amount)}>
                        {toCurrency(amount, money.precision)}
                      </td>
                      <td
                        align="left"
                        className={clsx('minWidth currency', styles.row__currency_symbol)}
                        dangerouslySetInnerHTML={{ __html: money.symbol }}
                      />
                    </TreeTableRow>
                  ))}
                </>
              );
            })}
          </tbody>
        </table>
      </section>
    </div>
  );
});
