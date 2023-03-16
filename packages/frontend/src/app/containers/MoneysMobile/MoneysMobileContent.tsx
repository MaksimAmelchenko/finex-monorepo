import React, { useCallback, useEffect, useState } from 'react';
import { observer } from 'mobx-react-lite';

import { AddButton, BackButton, Header } from '../../components/Header/Header';
import { IMoney } from '../../types/money';
import { Money } from '../../stores/models/money';
import { MoneyRow } from './MoneyRow/MoneyRow';
import { MoneyWindowMobile } from '../MoneyWindowMobile/MoneyWindowMobile';
import { MoneysRepository } from '../../stores/moneys-repository';
import { SideSheetBody } from '../../components/SideSheetMobile/SideSheetBody/SideSheetBody';
import { SideSheetMobile } from '../../components/SideSheetMobile/SideSheetMobile';
import { analytics } from '../../lib/analytics';
import { getT } from '../../lib/core/i18n';
import { useStore } from '../../core/hooks/use-store';

const t = getT('MoneysMobile');

export interface MoneysMobileContentProps {
  onSelect?: (money: Money) => void;
  onClose: () => void;
}

export const MoneysMobileContent = observer<MoneysMobileContentProps>(({ onSelect, onClose }) => {
  const moneysRepository = useStore(MoneysRepository);
  const [money, setMoney] = useState<Partial<IMoney> | Money | null>(null);

  const isSelectMode = Boolean(onSelect);

  useEffect(() => {
    analytics.view({
      page_title: 'moneys-mobile',
    });
  }, []);

  const handleAddClick = useCallback(() => {
    setMoney({});
  }, []);

  const handleClick = useCallback(
    (money: Money, event: React.MouseEvent<HTMLButtonElement>) => {
      if (isSelectMode) {
        onSelect?.(money);
      } else {
        setMoney(money);
      }
    },
    [isSelectMode, onSelect]
  );

  const { moneys } = moneysRepository;

  return (
    <>
      <Header
        title={t('Moneys')}
        startAdornment={<BackButton onClick={onClose} />}
        endAdornment={<AddButton onClick={handleAddClick} />}
      />
      <SideSheetBody>
        {moneys
          .filter(({ isEnabled }) => !isSelectMode || (isSelectMode && isEnabled))
          .map(money => (
            <MoneyRow money={money} onClick={handleClick} key={money.id} />
          ))}
      </SideSheetBody>

      <SideSheetMobile open={Boolean(money)}>
        {money && <MoneyWindowMobile money={money} onClose={() => setMoney(null)} />}
      </SideSheetMobile>
    </>
  );
});

export default MoneysMobileContent;
