import React, { useMemo } from 'react';
import clsx from 'clsx';
import { observer } from 'mobx-react-lite';

import { CashFlow } from '../../../stores/models/cash-flow';
import { CheckboxSvg, CheckboxUncheckedSvg, Tag } from '@finex/ui-kit';
import { MoneysRepository } from '../../../stores/moneys-repository';
import { formatDate, toCurrency } from '../../../lib/core/i18n';
import { useStore } from '../../../core/hooks/use-store';

import styles from './CashFlowRow.module.scss';

interface CashFlowRowProps {
  cashFlow: CashFlow;
  onClick: (cashFlow: CashFlow) => void;
}

export const CashFlowRow = observer<CashFlowRowProps>(({ cashFlow, onClick }) => {
  const { contractor, cashFlowDate, isDeleting, isSelected, accounts, categories, note, tags } = cashFlow;
  const moneysRepository = useStore(MoneysRepository);

  const handleOnSelect = (event: React.SyntheticEvent) => {
    event.stopPropagation();
    cashFlow.toggleSelection();
  };

  const handleOnClick = (event: React.SyntheticEvent) => {
    onClick(cashFlow);
  };

  const balances = useMemo(() => {
    return cashFlow.balances.sort(
      (a, b) => moneysRepository.moneys.indexOf(a.money) - moneysRepository.moneys.indexOf(b.money)
    );
  }, [cashFlow.balances]);

  return (
    <tr onClick={handleOnClick} className={clsx(isDeleting && styles.row_is_deleting)}>
      <td className={clsx(styles.firstColumn, 'min-width')}>
        <div className={clsx(styles.dateColumn)} onClick={handleOnSelect}>
          <div className={clsx(styles.dateColumn__colorMark)} />
          <div className={styles.dateColumn__checkbox}>
            <img src={isSelected ? CheckboxSvg : CheckboxUncheckedSvg} alt="" />
          </div>
          <div className={styles.dateColumn__dateContainer}>
            <div className={styles.dateColumn__date}>{formatDate(cashFlowDate)}</div>
          </div>
        </div>
      </td>

      <td>
        <div>{accounts.map(({ name }) => name).join(', ')}</div>
        {contractor && <div className={styles.contractor}>{contractor.name}</div>}
      </td>

      <td>
        <div>{categories.map(({ name }) => name).join(', ')}</div>
      </td>

      <td className="text-end numeric">
        {balances.map(({ money, income }) => {
          return income ? <div key={money.id}>{toCurrency(income, money.precision)}</div> : null;
        })}
      </td>

      <td className="currency">
        {balances.map(({ money, income }) => {
          return income ? <div dangerouslySetInnerHTML={{ __html: money.symbol }} key={money.id} /> : null;
        })}
      </td>

      <td className="text-end numeric">
        {balances.map(({ money, expense }) => {
          return expense ? <div key={money.id}>{toCurrency(expense, money.precision)}</div> : null;
        })}
      </td>

      <td className="currency">
        {balances.map(({ money, expense }) => {
          return expense ? <div dangerouslySetInnerHTML={{ __html: money.symbol }} key={money.id} /> : null;
        })}
      </td>

      <td className="text-end numeric">
        {balances.map(({ money, income, expense }) => {
          return <div key={money.id}>{toCurrency(income - expense, money.precision)}</div>;
        })}
      </td>

      <td className="currency">
        {balances.map(({ money }) => {
          return <div dangerouslySetInnerHTML={{ __html: money.symbol }} key={money.id} />;
        })}
      </td>

      <td className="hidden-sm min-width">{note}</td>
      <td className="hidden-sm min-width">
        {tags.length > 0 && (
          <div className={styles.tags}>
            {tags.map(tag => (
              <Tag key={tag.id}>{tag.name}</Tag>
            ))}
          </div>
        )}
      </td>
    </tr>
  );
});