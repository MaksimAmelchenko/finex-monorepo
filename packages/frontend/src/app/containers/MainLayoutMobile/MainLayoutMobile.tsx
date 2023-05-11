import React, { Suspense, useCallback, useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import { Navigate, Route, Routes, useLocation, useNavigate, matchPath } from 'react-router-dom';

import { AppStore } from '../../stores/app-store';
import { BottomNavigation } from './BottomNavigation/BottomNavigation';
import { CashFlowWindowMobile } from '../CashFlowWindowMobile/CashFlowWindowMobile';
import { ConnectionNordigenCompleteMobileLazy } from '../../pages/ConnectionNordigenCompleteMobile/ConnectionNordigenCompleteMobileLazy';
import { CreateTransactionData, UpdateTransactionChanges } from '../../types/transaction';
import { DebtWindowMobile } from '../DebtWindowMobile/DebtWindowMobile';
import { DebtsMobileLazy } from '../../pages/DebtsMobile/DebtsMobileLazy';
import { ExchangeWindowMobile } from '../ExchangeWindowMobile/ExchangeWindowMobile';
import { HistoryLazy } from '../../pages/History/HistoryLazy';
import { Loader } from '../../components/Loader/Loader';
import { MainLayoutStoreMobile, Window } from '../../stores/main-layout-store-mobile';
import { OperationsRepository } from '../../stores/operations-repository';
import { OutcomeMobileLazy } from '../../pages/OutcomeMobile/OutcomeMobileLazy';
import { PlanningMobileLazy } from '../../pages/PlanningMobile/PlanningMobileLazy';
import { ProfileRepository } from '../../stores/profile-repository';
import { SideSheet } from '../../pages/SettingsMobile/types';
import { SideSheetMobile } from '../../components/SideSheetMobile/SideSheetMobile';
import { TransactionWindowMobile } from '../TransactionWindowMobile/TransactionWindowMobile';
import { TransferWindowMobile } from '../TransferWindowMobile/TransferWindowMobile';
import { useStore } from '../../core/hooks/use-store';

import styles from './MainLayoutMobile.module.scss';

export const MainLayoutMobile = observer(() => {
  const mainLayoutStore = useStore(MainLayoutStoreMobile);
  const appStore = useStore(AppStore);
  const operationsRepository = useStore(OperationsRepository);
  const profileRepository = useStore(ProfileRepository);

  const navigate = useNavigate();
  const location = useLocation();

  const { profile } = profileRepository;

  const handleCloseWindow = useCallback(() => {
    switch (mainLayoutStore.window) {
      case Window.AddIncomeTransaction:
      case Window.AddExpenseTransaction:
      case Window.AddTransfer:
      case Window.AddExchange: {
        navigate('/history#operaions');
        break;
      }
      case Window.AddCashFlow: {
        navigate('/history#cash-flows');
        break;
      }
      case Window.AddDebt: {
        navigate('/debts');
        break;
      }
    }
    mainLayoutStore.hideWindow();
  }, [mainLayoutStore, navigate]);

  const handleMenuItemClick = useCallback(
    (menuItemId: string) => {
      const map: Record<string, Window> = {
        addExpense: Window.AddExpenseTransaction,
        addIncome: Window.AddIncomeTransaction,
        addCashFlow: Window.AddCashFlow,
        addDebt: Window.AddDebt,
        addTransfer: Window.AddTransfer,
        addExchange: Window.AddExchange,
      };
      const window = map[menuItemId] ?? Window.None;
      mainLayoutStore.showWindow(window);
    },
    [mainLayoutStore]
  );

  useEffect(() => {
    const { pathname } = location;
    {
      const match = matchPath('/settings/connections/:connectionId', pathname);
      if (match) {
        const { connectionId } = match.params;
        appStore.openSettings(SideSheet.Connections, { pathname, connectionId });
        return;
      }
    }

    {
      const match = matchPath('/settings/:sideSheet', pathname);

      if (match && match.params.sideSheet) {
        const { sideSheet } = match.params;
        appStore.openSettings(sideSheet as SideSheet, { pathname });
        return;
      }
    }
  }, [appStore, location]);

  const openExpenseTransactionWindow = mainLayoutStore.window === Window.AddExpenseTransaction;
  const openIncomeTransactionWindow = mainLayoutStore.window === Window.AddIncomeTransaction;
  const openCashFlowWindow = mainLayoutStore.window === Window.AddCashFlow;
  const openDebtWindow = mainLayoutStore.window === Window.AddDebt;
  const openTransferWindow = mainLayoutStore.window === Window.AddTransfer;
  const openExchangeWindow = mainLayoutStore.window === Window.AddExchange;

  const handleCreateTransaction = (data: CreateTransactionData) => {
    return operationsRepository.createTransaction(data);
  };

  const handleUpdateTransaction = (cashFlowId: string, transactionId: string, changes: UpdateTransactionChanges) => {
    return operationsRepository.updateTransaction(transactionId, changes);
  };

  const handleDeleteTransaction = (cashFlowId: string, transactionId: string) => {
    return operationsRepository.deleteTransaction(transactionId);
  };

  if (!profile) {
    return <Loader />;
  }

  return (
    <div className={styles.root}>
      <Suspense fallback={<Loader />}>
        <Routes>
          <Route path="/outcome" element={<OutcomeMobileLazy />} />
          <Route path="/history" element={<HistoryLazy />} />
          <Route path="/debts" element={<DebtsMobileLazy />} />
          <Route path="/planning" element={<PlanningMobileLazy />} />
          <Route
            path="/connections/nordigen/requisitions/complete"
            element={<ConnectionNordigenCompleteMobileLazy />}
          />

          <Route path="*" element={<Navigate to="/history" />} />
        </Routes>
      </Suspense>

      <BottomNavigation onMenuItemClick={handleMenuItemClick} />

      <SideSheetMobile open={openExpenseTransactionWindow || openIncomeTransactionWindow}>
        <TransactionWindowMobile
          transaction={{ sign: openExpenseTransactionWindow ? -1 : 1 }}
          onClose={handleCloseWindow}
          onCreate={handleCreateTransaction}
          onUpdate={handleUpdateTransaction}
          onDelete={handleDeleteTransaction}
        />
      </SideSheetMobile>

      <SideSheetMobile open={openCashFlowWindow}>
        <CashFlowWindowMobile cashFlow={{}} onClose={handleCloseWindow} />
      </SideSheetMobile>

      <SideSheetMobile open={openDebtWindow}>
        <DebtWindowMobile debt={{}} onClose={handleCloseWindow} />
      </SideSheetMobile>

      <SideSheetMobile open={openTransferWindow}>
        <TransferWindowMobile transfer={{}} onClose={handleCloseWindow} />
      </SideSheetMobile>

      <SideSheetMobile open={openExchangeWindow}>
        <ExchangeWindowMobile exchange={{}} onClose={handleCloseWindow} />
      </SideSheetMobile>
    </div>
  );
});

export default MainLayoutMobile;
