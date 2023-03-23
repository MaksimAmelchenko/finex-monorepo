import React, { useCallback, useEffect, useState } from 'react';
import { observer } from 'mobx-react-lite';

import { AddButton, BackButton, Header } from '../../components/Header/Header';
import { Button, Coins02Icon, PlusIcon } from '@finex/ui-kit';
import { EmptyState } from '../../components/EmptyState/EmptyState';
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

import styles from './MoneysMobileContent.module.scss';

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

  const moneys = moneysRepository.moneys.filter(({ isEnabled }) => !isSelectMode || (isSelectMode && isEnabled));

  function renderContent(): JSX.Element {
    if (!moneys.length) {
      return (
        <div className={styles.root__emptyState}>
          <EmptyState
            illustration={<Coins02Icon className={styles.root__emptyStateIllustration} />}
            text={t('You do not have moneys yet')}
            supportingText={t('Start creating by clicking on\u00A0"Create\u00A0money"')}
          >
            <Button size="sm" startIcon={<PlusIcon />} onClick={handleAddClick}>
              {t('Create money')}
            </Button>
          </EmptyState>
        </div>
      );
    }

    return (
      <>
        {moneys.map(money => (
          <MoneyRow money={money} onClick={handleClick} key={money.id} />
        ))}
      </>
    );
  }

  return (
    <>
      <Header
        title={t('Moneys')}
        startAdornment={<BackButton onClick={onClose} />}
        endAdornment={<AddButton onClick={handleAddClick} />}
      />
      <SideSheetBody>{renderContent()}</SideSheetBody>

      <SideSheetMobile open={Boolean(money)}>
        {money && <MoneyWindowMobile money={money} onClose={() => setMoney(null)} />}
      </SideSheetMobile>
    </>
  );
});

export default MoneysMobileContent;
