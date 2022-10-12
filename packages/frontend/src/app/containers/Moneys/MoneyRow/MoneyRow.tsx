import React from 'react';
import clsx from 'clsx';
import { observer } from 'mobx-react-lite';

import { Checkbox, Image, TickSvg } from '@finex/ui-kit';
import { Money } from '../../../stores/models/money';

import styles from './MoneyRow.module.scss';

interface MoneyRowProps {
  money: Money;
  onClick: (money: Money) => void;
}

export const MoneyRow = observer<MoneyRowProps>(({ money, onClick }: MoneyRowProps) => {
  const { currency, name, symbol, precision, isEnabled, isSelected, isDeleting } = money;

  const handleOnSelect = () => {
    money.toggleSelection();
  };

  const handleClick = (event: React.SyntheticEvent) => {
    event.stopPropagation();
    event.preventDefault();
    onClick(money);
  };

  return (
    <tr onClick={handleOnSelect} className={clsx(isDeleting && styles.row_is_deleting)}>
      <td className="min-width">
        <Checkbox value={isSelected} onChange={handleOnSelect} />
      </td>
      <td>
        <span className={styles.name} onClick={handleClick}>
          {name}
        </span>
      </td>
      <td>
        <span dangerouslySetInnerHTML={{ __html: symbol }} />
      </td>
      <td className={styles.tick}>{isEnabled && <Image src={TickSvg} alt="active" />}</td>
      <td>{currency?.name}</td>
    </tr>
  );
});
