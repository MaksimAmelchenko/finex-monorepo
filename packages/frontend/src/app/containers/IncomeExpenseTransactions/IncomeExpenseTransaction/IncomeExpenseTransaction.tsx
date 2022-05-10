import React from 'react';
import clsx from 'clsx';
import { isBefore, parseISO } from 'date-fns';
import { observer } from 'mobx-react-lite';

import { CategoriesRepository } from '../../../stores/categories-repository';
import { CheckboxSvg, CheckboxUncheckedSvg, Tag } from '@finex/ui-kit';
import { IncomeExpenseTransaction as IncomeExpenseTransactionModel } from '../../../stores/models/income-expense-transaction';
import { formatDate, getT, toCurrency } from '../../../lib/core/i18n';
import { useStore } from '../../../core/hooks/use-store';

import styles from './IncomeExpenseTransaction.module.scss';

const t = getT('CashFlow');

interface IIncomeExpenseTransactionProps {
  incomeExpenseTransaction: IncomeExpenseTransactionModel;
}

export const IncomeExpenseTransaction = observer(({ incomeExpenseTransaction }: IIncomeExpenseTransactionProps) => {
  const categoriesRepository = useStore(CategoriesRepository);
  const {
    id,
    transactionDate,
    account,
    contractor,
    category,
    sign,
    amount,
    money,
    planId,
    note,
    tags,
    colorMark,
    isNotConfirmed,
    isSelected,
  } = incomeExpenseTransaction;

  const handleOnSelect = () => {
    incomeExpenseTransaction.toggleSelection();
  };

  const isPlanned = Boolean(planId);
  const isOverdue = (isPlanned || isNotConfirmed) && isBefore(parseISO(transactionDate), new Date().setHours(0, 0, 0));

  return (
    <tr>
      <td className={clsx(styles.firstColumn, 'min-width')}>
        <div
          className={clsx(
            styles.dateColumn,
            isPlanned && styles.dateColumn_planned,
            isOverdue && styles.dateColumn_overdue
          )}
          onClick={handleOnSelect}
        >
          <div className={clsx(styles.dateColumn__colorMark, colorMark)} />
          <div className={styles.dateColumn__checkbox}>
            <img src={isSelected ? CheckboxSvg : CheckboxUncheckedSvg} alt="" />
          </div>
          <div className={styles.dateColumn__dateContainer}>
            {isPlanned ? (
              <>
                <div className={styles.dateColumn__date}>{formatDate(transactionDate)}</div>
                <div className={styles.dateColumn__label}>
                  {isOverdue ? <span>{t('Overdue')}</span> : <span>{t('Planned')}</span>}
                </div>
              </>
            ) : isNotConfirmed ? (
              <>
                <div className={styles.dateColumn__date}>{formatDate(transactionDate)}</div>
                <div className={styles.dateColumn__label}>
                  <span className="txt-color-red">{t('Not confirmed')}</span>
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
        <div>{category.name}</div>
        <div className={styles.categoryPath}>{categoriesRepository.path(category.id)}</div>
      </td>

      {sign === 1 ? (
        <>
          <td className="text-end hidden-sm hidden-md numeric">{toCurrency(amount, money.precision)}</td>
          <td className="hidden-sm hidden-md currency" dangerouslySetInnerHTML={{ __html: money.symbol }} />
        </>
      ) : (
        <td colSpan={2} />
      )}

      {sign === -1 ? (
        <>
          <td className="text-end hidden-sm hidden-md numeric">{toCurrency(-amount, money.precision)}</td>
          <td className="hidden-sm hidden-md currency" dangerouslySetInnerHTML={{ __html: money.symbol }} />
        </>
      ) : (
        <td colSpan={2} />
      )}

      {/*<td className="text-end hidden-lg numeric">{toCurrency(sign * amount, money.precision)}</td>*/}
      {/*<td className="hidden-lg currency" dangerouslySetInnerHTML={{ __html: money.symbol }} />*/}

      <td className="hidden-sm">{note}</td>
      <td className="hidden-sm">
        {tags.map(tag => (
          <Tag key={tag}>{tag}</Tag>
        ))}
      </td>
    </tr>
  );
});
