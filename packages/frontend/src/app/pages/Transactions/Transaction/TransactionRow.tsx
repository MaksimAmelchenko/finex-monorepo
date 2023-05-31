import React from 'react';
import clsx from 'clsx';
import { isBefore, parseISO } from 'date-fns';
import { observer } from 'mobx-react-lite';

import { BaseCheckbox, Tag } from '@finex/ui-kit';
import { PlannedTransaction } from '../../../stores/models/planned-transaction';
import { Transaction } from '../../../stores/models/transaction';
import { formatDate, getT, toCurrency } from '../../../lib/core/i18n';

import styles from './TransactionRow.module.scss';

const t = getT('CashFlow');

interface TransactionRowProps {
  transaction: PlannedTransaction | Transaction;
  isHighlighted: boolean;
  onClick: (transaction: PlannedTransaction | Transaction) => void;
}

export const TransactionRow = observer<TransactionRowProps>(({ transaction, isHighlighted, onClick }) => {
  const { transactionDate, account, contractor, category, sign, amount, money, note, tags, isSelected, isDeleting } =
    transaction;

  const handleOnSelect = (event: React.SyntheticEvent) => {
    event.stopPropagation();
    transaction.toggleSelection();
  };

  const handleClick = (event: React.SyntheticEvent) => {
    onClick(transaction);
  };

  const isPlanned = transaction instanceof PlannedTransaction;
  const isOverdue =
    (isPlanned || transaction.isNotConfirmed) && isBefore(parseISO(transactionDate), new Date().setHours(0, 0, 0));

  return (
    <tr
      onClick={handleClick}
      className={clsx(styles.root, isDeleting && styles.root_is_deleting, isHighlighted && styles.root_isHighlighted)}
    >
      <td className={clsx(styles.firstColumn, 'min-width')} onClick={handleOnSelect}>
        <div
          className={clsx(
            styles.dateColumn,
            isPlanned && styles.dateColumn_planned,
            isOverdue && styles.dateColumn_overdue
          )}
        >
          <div className={clsx(styles.dateColumn__colorMark, isPlanned && transaction.markerColor)} />
          <BaseCheckbox value={isSelected} />
          <div className={styles.dateColumn__dateContainer}>
            {isPlanned ? (
              <>
                <div className={styles.dateColumn__date}>{formatDate(transactionDate)}</div>
                <div className={styles.dateColumn__label}>
                  {isOverdue ? <span>{t('Overdue')}</span> : <span>{t('Planned')}</span>}
                </div>
              </>
            ) : transaction.isNotConfirmed ? (
              <>
                <div className={styles.dateColumn__date}>{formatDate(transactionDate)}</div>
                <div className={styles.dateColumn__label}>
                  <span className={styles.dateColumn_not_confirmed}>{t('Not confirmed')}</span>
                  <br />
                  {isOverdue && <span>{t('Overdue')}</span>}
                </div>
              </>
            ) : (
              <div className={styles.dateColumn__date}>{formatDate(transactionDate)}</div>
            )}
          </div>
        </div>
      </td>

      <td>
        <div>{account.name}</div>
        <div>{contractor?.name}</div>
      </td>

      <td>
        <div className={clsx(styles.root__category, !category && styles.root__category_uncategorized)}>
          {category?.name || t('Uncategorized')}
        </div>
        {category && <div className={styles.root__categoryPath}>{category.fullPath()}</div>}
      </td>

      {sign === 1 ? (
        <td className="text-end hidden-sm hidden-md numeric">
          {toCurrency(amount, { unit: money.symbol, precision: money.precision })}
        </td>
      ) : (
        <td className="hidden-sm hidden-md" />
      )}

      {sign === -1 ? (
        <td className="text-end hidden-sm hidden-md numeric">
          {toCurrency(-amount, { unit: money.symbol, precision: money.precision })}
        </td>
      ) : (
        <td className="hidden-sm hidden-md" />
      )}

      <td className="text-end hidden-lg numeric">
        {toCurrency(sign * amount, { unit: money.symbol, precision: money.precision })}
      </td>

      <td className="hidden-sm min-width">{note}</td>
      <td className="hidden-sm min-width">
        <div className={styles.tags}>
          {tags.map(tag => (
            <Tag key={tag.id}>{tag.name}</Tag>
          ))}
        </div>
      </td>
    </tr>
  );
});
