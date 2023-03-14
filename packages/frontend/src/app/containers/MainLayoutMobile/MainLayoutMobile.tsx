import React, { Suspense, useCallback } from 'react';
import { observer } from 'mobx-react-lite';

import { BottomNavigation } from './BottomNavigation/BottomNavigation';
import { Drawer } from '../../components/Drawer/Drawer';
import { ExchangeWindowMobile } from '../ExchangeWindowMobile/ExchangeWindowMobile';
import { Loader } from '../../components/Loader/Loader';
import { MainLayoutStoreMobile, Window } from '../../stores/main-layout-store-mobile';
import { ProfileRepository } from '../../stores/profile-repository';
import { TransactionWindowMobile } from '../TransactionWindowMobile/TransactionWindowMobile';
import { TransferWindowMobile } from '../TransferWindowMobile/TransferWindowMobile';
import { useStore } from '../../core/hooks/use-store';

import styles from './MainLayoutMobile.module.scss';

interface MainLayoutMobileProps {
  children: React.ReactNode;
}

export const MainLayoutMobile = observer<MainLayoutMobileProps>(({ children }) => {
  const profileRepository = useStore(ProfileRepository);
  const mainLayoutStore = useStore(MainLayoutStoreMobile);

  const { profile } = profileRepository;

  const handleCloseWindow = useCallback(() => {
    mainLayoutStore.hideWindow();
  }, []);

  const handleMenuItemClick = useCallback((menuItemId: string) => {
    const map: Record<string, Window> = {
      addExpense: Window.AddExpenseTransaction,
      addIncome: Window.AddIncomeTransaction,
      addTransfer: Window.AddTransfer,
      addExchange: Window.AddExchange,
    };
    const window = map[menuItemId] ?? Window.None;
    mainLayoutStore.showWindow(window);
  }, []);

  const openExpenseTransactionWindow = mainLayoutStore.window === Window.AddExpenseTransaction;
  const openIncomeTransactionWindow = mainLayoutStore.window === Window.AddIncomeTransaction;
  const openTransactionWindow = openExpenseTransactionWindow || openIncomeTransactionWindow;
  const openTransferWindow = mainLayoutStore.window === Window.AddTransfer;
  const openExchangeWindow = mainLayoutStore.window === Window.AddExchange;

  if (!profile) {
    return <Loader />;
  }

  return (
    <div className={styles.page}>
      <Suspense fallback={<Loader />}>{children}</Suspense>

      <BottomNavigation onMenuItemClick={handleMenuItemClick} />

      <Drawer open={openTransactionWindow}>
        <TransactionWindowMobile
          transaction={{ sign: openExpenseTransactionWindow ? -1 : 1 }}
          onClose={handleCloseWindow}
        />
      </Drawer>

      <Drawer open={openTransferWindow}>
        <TransferWindowMobile transfer={{}} onClose={handleCloseWindow} />
      </Drawer>

      <Drawer open={openExchangeWindow}>
        <ExchangeWindowMobile exchange={{}} onClose={handleCloseWindow} />
      </Drawer>
    </div>
  );
});
