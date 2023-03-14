import React, { useCallback, useEffect } from 'react';
import { observer } from 'mobx-react-lite';

import { BackButton, Header } from '../../components/Header/Header';
import { Money } from '../../stores/models/money';
import { MoneyRow } from './MoneyRow/MoneyRow';
import { MoneysRepository } from '../../stores/moneys-repository';
import { SideSheetBody } from '../../components/SideSheetMobile/SideSheetBody/SideSheetBody';
import { getT } from '../../lib/core/i18n';
import { useStore } from '../../core/hooks/use-store';
import { analytics } from '../../lib/analytics';

const t = getT('MoneysMobile');

export interface MoneysMobileContentProps {
  onSelect?: (money: Money) => void;
  onClose: () => void;
}

export const MoneysMobileContent = observer<MoneysMobileContentProps>(({ onSelect, onClose }) => {
  const moneysRepository = useStore(MoneysRepository);
  const isSelectMode = Boolean(onSelect);

  useEffect(() => {
    analytics.view({
      page_title: 'moneys-mobile',
    });
  }, []);

  const handleClick = useCallback(
    (money: Money, event: React.MouseEvent<HTMLButtonElement>) => {
      if (isSelectMode) {
        onSelect?.(money);
      }
    },
    [isSelectMode, onSelect]
  );

  const { moneys } = moneysRepository;

  return (
    <>
      <Header title={t('Moneys')} startAdornment={<BackButton onClick={onClose} />} />
      <SideSheetBody>
        {moneys
          .filter(({ isEnabled }) => !isSelectMode || (isSelectMode && isEnabled))
          .map(money => {
            return <MoneyRow money={money} onClick={handleClick} key={money.id} />;
          })}
      </SideSheetBody>
    </>
  );
});

export default MoneysMobileContent;
