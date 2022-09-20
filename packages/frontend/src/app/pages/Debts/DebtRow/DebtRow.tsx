import React from 'react';
import clsx from 'clsx';
import { observer } from 'mobx-react-lite';

import { CheckboxSvg, CheckboxUncheckedSvg, Tag } from '@finex/ui-kit';
import { Debt } from '../../../stores/models/debt';
import { MoneysRepository } from '../../../stores/moneys-repository';
import { formatDate, toCurrency } from '../../../lib/core/i18n';
import { useStore } from '../../../core/hooks/use-store';

import styles from './DebtRow.module.scss';

interface DebtRowProps {
  debt: Debt;
  onClick: (debt: Debt) => void;
}

export const DebtRow = observer<DebtRowProps>(({ debt, onClick }) => {
  const { balance, contractor, debtDate, isDeleting, isSelected, note, tags } = debt;
  const moneysRepository = useStore(MoneysRepository);

  const handleOnSelect = (event: React.SyntheticEvent) => {
    event.stopPropagation();
    debt.toggleSelection();
  };

  const handleOnClick = (event: React.SyntheticEvent) => {
    onClick(debt);
  };

  return (
    <tr onClick={handleOnClick} className={clsx(isDeleting && styles.row_is_deleting)}>
      <td className={clsx(styles.firstColumn, 'min-width')}>
        <div className={clsx(styles.dateColumn)} onClick={handleOnSelect}>
          <div className={clsx(styles.dateColumn__colorMark)} />
          <div className={styles.dateColumn__checkbox}>
            <img src={isSelected ? CheckboxSvg : CheckboxUncheckedSvg} alt="" />
          </div>
          <div className={styles.dateColumn__dateContainer}>
            <div className={styles.dateColumn__date}>{formatDate(debtDate)}</div>
          </div>
        </div>
      </td>

      <td>
        <div>{contractor.name}</div>
      </td>

      <td className="text-end numeric">
        {moneysRepository.moneys.map(money => {
          if (balance[money.id]?.['debt']) {
            return <div key={money.id}>{toCurrency(balance[money.id]['debt'], money.precision)}</div>;
          }
          return null;
        })}
      </td>

      <td className="currency">
        {moneysRepository.moneys.map(money => {
          if (balance[money.id]?.['debt']) {
            return <div dangerouslySetInnerHTML={{ __html: money.symbol }} key={money.id} />;
          }
          return null;
        })}
      </td>

      <td className="text-end numeric">
        {moneysRepository.moneys.map(money => {
          if (balance[money.id]?.['paidDebt']) {
            return <div key={money.id}>{toCurrency(balance[money.id]['paidDebt'], money.precision)}</div>;
          }
          return null;
        })}
      </td>

      <td className="currency">
        {moneysRepository.moneys.map(money => {
          if (balance[money.id]?.['paidDebt']) {
            return <div dangerouslySetInnerHTML={{ __html: money.symbol }} key={money.id} />;
          }
          return null;
        })}
      </td>

      <td className="text-end numeric">
        {moneysRepository.moneys.map(money => {
          const remainingDebt = (balance[money.id]?.['debt'] ?? 0) + (balance[money.id]?.['paidDebt'] ?? 0);
          if (remainingDebt) {
            return <div key={money.id}>{toCurrency(remainingDebt, money.precision)}</div>;
          }
          return null;
        })}
      </td>

      <td className="currency">
        {moneysRepository.moneys.map(money => {
          const remainingDebt = (balance[money.id]?.['debt'] ?? 0) + (balance[money.id]?.['paidDebt'] ?? 0);
          if (remainingDebt) {
            return <div dangerouslySetInnerHTML={{ __html: money.symbol }} key={money.id} />;
          }
          return null;
        })}
      </td>

      <td className="text-end numeric">
        {moneysRepository.moneys.map(money => {
          if (balance[money.id]?.['paidInterest']) {
            return <div key={money.id}>{toCurrency(balance[money.id]['paidInterest'], money.precision)}</div>;
          }
          return null;
        })}
      </td>

      <td className="currency">
        {moneysRepository.moneys.map(money => {
          if (balance[money.id]?.['paidInterest']) {
            return <div dangerouslySetInnerHTML={{ __html: money.symbol }} key={money.id} />;
          }
          return null;
        })}
      </td>

      <td className="text-end numeric">
        {moneysRepository.moneys.map(money => {
          if (balance[money.id]?.['fine']) {
            return <div key={money.id}>{toCurrency(balance[money.id]['fine'], money.precision)}</div>;
          }
          return null;
        })}
      </td>

      <td className="currency">
        {moneysRepository.moneys.map(money => {
          if (balance[money.id]?.['fine']) {
            return <div dangerouslySetInnerHTML={{ __html: money.symbol }} key={money.id} />;
          }
          return null;
        })}
      </td>

      <td className="text-end numeric">
        {moneysRepository.moneys.map(money => {
          if (balance[money.id]?.['fee']) {
            return <div key={money.id}>{toCurrency(balance[money.id]['fee'], money.precision)}</div>;
          }
          return null;
        })}
      </td>

      <td className="currency">
        {moneysRepository.moneys.map(money => {
          if (balance[money.id]?.['fee']) {
            return <div dangerouslySetInnerHTML={{ __html: money.symbol }} key={money.id} />;
          }
          return null;
        })}
      </td>

      <td className="text-end numeric">
        {moneysRepository.moneys.map(money => {
          const cost =
            (balance[money.id]?.['paidInterest'] ?? 0) +
            (balance[money.id]?.['fine'] ?? 0) +
            (balance[money.id]?.['fee'] ?? 0);
          const isThere = !(
            balance[money.id]?.['paidInterest'] === undefined &&
            balance[money.id]?.['fine'] === undefined &&
            balance[money.id]?.['fee'] === undefined
          );
          if (cost && isThere) {
            return <div key={money.id}>{toCurrency(cost, money.precision)}</div>;
          }
          return null;
        })}
      </td>

      <td className="currency">
        {moneysRepository.moneys.map(money => {
          const isThere = !(
            balance[money.id]?.['paidInterest'] === undefined &&
            balance[money.id]?.['fine'] === undefined &&
            balance[money.id]?.['fee'] === undefined
          );
          if (isThere) {
            return <div dangerouslySetInnerHTML={{ __html: money.symbol }} key={money.id} />;
          }
          return null;
        })}
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
