import React, { useCallback } from 'react';
import { observer } from 'mobx-react-lite';

import { Drawer } from '../../components/Drawer/Drawer';
import { BackButton, Header } from '../../components/Header/Header';
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
  const isSelectMode = Boolean(onSelect);

  const handleClick = useCallback(
    (money: Money, event: React.MouseEvent<HTMLButtonElement>) => {
      if (isSelectMode) {
        onSelect(money);
      }
    },
    [isSelectMode, onSelect]
  );

  const { moneys } = moneysRepository;

  return (
    <Drawer open={open} className={styles.root}>
      <Header title={t('Moneys')} startAdornment={<BackButton onClick={onClose} />} />
      <main className={styles.root__main}>
        {moneys
          .filter(({ isEnabled }) => !isSelectMode || (isSelectMode && isEnabled))
          .map(money => {
            return <MoneyRow money={money} onClick={handleClick} key={money.id} />;
          })}
      </main>
    </Drawer>
  );
});
