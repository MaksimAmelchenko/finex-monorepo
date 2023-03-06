import React from 'react';
import { observer } from 'mobx-react-lite';

import { Drawer } from '../../components/Drawer/Drawer';
import { Header } from '../../components/Header/Header';
import { Money } from '../../stores/models/money';
import { MoneyRow } from './MoneyRow/MoneyRow';
import { MoneysRepository } from '../../stores/moneys-repository';
import { getT } from '../../lib/core/i18n';
import { useStore } from '../../core/hooks/use-store';

import styles from './MoneysMobile.module.scss';

const t = getT('MoneysMobile');

interface MoneysMobileProps {
  open: boolean;
  onSelect: (money: Money) => void;
  onClose: () => void;
}

export const MoneysMobile = observer<MoneysMobileProps>(({ open, onSelect, onClose }) => {
  const moneysRepository = useStore(MoneysRepository);
  const { moneys } = moneysRepository;
  const isSelectMode = Boolean(onSelect);

  const handleOnClick = (money: Money, event: React.MouseEvent<HTMLButtonElement>) => {
    if (isSelectMode) {
      onSelect(money);
    }
  };

  return (
    <Drawer open={open} className={styles.root}>
      <Header title={t('Moneys')} onClickBack={onClose} onClickAdd={() => {}} />
      <main className={styles.root__main}>
        {moneys
          .filter(({ isEnabled }) => !isSelectMode || (isSelectMode && isEnabled))
          .map(money => {
            return <MoneyRow money={money} onClick={handleOnClick} key={money.id} />;
          })}
      </main>
    </Drawer>
  );
});
