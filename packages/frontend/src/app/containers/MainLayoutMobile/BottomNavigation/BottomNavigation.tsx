import React, { useCallback, useState } from 'react';

import { BottomNavigationButton } from './BottomNavigationButton/BottomNavigationButton';
import { CenterBottomNavigationButton } from './CenterBottomNavigationButton/CenterBottomNavigationButton';
import {
  BottomSheet,
  CoinsHandIcon,
  CoinsStacked01Icon,
  MinusIcon,
  PlusIcon,
  RefreshCW03Icon,
  ReverseRightIcon,
  SwitchHorizontal01Icon,
} from '@finex/ui-kit';
import { getT } from '../../../lib/core/i18n';
import { MenuItem } from './MenuItem/MenuItem';

import styles from './BottomNavigation.module.scss';

const t = getT('BottomNavigation');
interface BottomNavigationProps {
  onMenuItemClick: (menuItemId: 'addExpense' | 'addIncome' | 'addTransfer' | 'addExchange') => void;
}
export function BottomNavigation({ onMenuItemClick }: BottomNavigationProps): JSX.Element {
  const [open, setOpen] = useState<boolean>(false);

  const handleAddClick = useCallback(() => {
    setOpen(true);
  }, []);

  const handleClose = useCallback(() => {
    setOpen(false);
  }, []);

  const handleMenuItemClick = useCallback(
    (event: React.MouseEvent<HTMLButtonElement>) => {
      const menuItemId = event.currentTarget.dataset['menuItemId'] as any;
      setOpen(false);
      onMenuItemClick(menuItemId);
    },
    [onMenuItemClick]
  );
  return (
    <>
      <nav className={styles.root}>
        <BottomNavigationButton href="/outcome" label={t('Outcome')} icon={OutcomeButtonIcon} />
        <BottomNavigationButton href="/operations" label={t('Operations')} icon={SwitchHorizontal01Icon} />
        <CenterBottomNavigationButton onClick={handleAddClick} />
        <BottomNavigationButton href="/debts" label={t('Debts')} icon={CoinsHandIcon} />
        <BottomNavigationButton href="/planning" label={t('Planning')} icon={CoinsStacked01Icon} />
      </nav>

      <BottomSheet open={open} onClose={handleClose}>
        <MenuItem data-menu-item-id="addExpense" onClick={handleMenuItemClick} icon={MinusIcon} label={t('Expense')} />
        <MenuItem data-menu-item-id="addIncome" onClick={handleMenuItemClick} icon={PlusIcon} label={t('Income')} />
        <MenuItem data-menu-item-id="addDebt" onClick={handleMenuItemClick} icon={CoinsHandIcon} label={t('Debt')} />
        <MenuItem
          data-menu-item-id="addTransfer"
          onClick={handleMenuItemClick}
          icon={ReverseRightIcon}
          label={t('Transfer')}
        />
        <MenuItem
          data-menu-item-id="addExchange"
          onClick={handleMenuItemClick}
          icon={RefreshCW03Icon}
          label={t('Exchange')}
        />
      </BottomSheet>
    </>
  );
}

function OutcomeButtonIcon(): JSX.Element {
  return <div className={styles.outcomeButtonIcon} />;
}
