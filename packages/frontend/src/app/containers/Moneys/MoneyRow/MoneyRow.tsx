import React from 'react';
import clsx from 'clsx';
import { observer } from 'mobx-react-lite';

import { Image, checkSvg, BaseCheckbox } from '@finex/ui-kit';
import { Money } from '../../../stores/models/money';

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
    onClick(money);
  };

  return (
    <tr className={clsx(isDeleting && 'is_deleting')}>
      <td className="checkboxCell" onClick={handleOnSelect}>
        <BaseCheckbox value={isSelected} />
      </td>
      <td>
        <span className="name" onClick={handleClick}>
          {name}
        </span>
      </td>
      <td>
        <span dangerouslySetInnerHTML={{ __html: symbol }} />
      </td>
      <td className="tickCell">{isEnabled && <Image src={checkSvg} alt="active" />}</td>
      <td>{currency?.name}</td>
    </tr>
  );
});
