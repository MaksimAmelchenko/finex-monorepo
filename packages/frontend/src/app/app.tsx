import React, { Suspense, useEffect } from 'react';
import ThemeProvider from '@mui/material/styles/ThemeProvider';
import { Route, Routes } from 'react-router-dom';
import { Slide } from '@mui/material';
import { SnackbarProvider } from 'notistack';
import { observer } from 'mobx-react-lite';

import { DashboardLazy } from './containers/Dashboard/DashboardLazy';
import { Debts } from './pages/Debts/Debts';
import { Exchanges } from './pages/Exchanges/Exchanges';
import { Home } from './pages/Home/Home';
import { IncomeExpenseCashFlows } from './containers/IncomeExpenseCashFlows/IncomeExpenseCashFlows';
import { IncomeExpenseTransactions } from './pages/IncomeExpenseTransactions/IncomeExpenseTransactions';
import { MainLayout } from './containers/MainLayout/MainLayout';
import { NotFoundLazy } from './pages/NotFound/NotFoundLazy';
import { RequireAuth } from './components/RequireAuth/RequireAuth';
import { ResetPasswordConfirmationLazy } from './pages/ResetPasswordConfirmation/ResetPasswordConfirmationLazy';
import { ResetPasswordLazy } from './pages/ResetPassword/ResetPasswordLazy';
import { SettingsLazy } from './pages/Settings/SettingsLazy';
import { SignInLazy } from './pages/SignIn/SignInLazy';
import { SignUpConfirmationLazy } from './pages/SignUpConfirmation/SignUpConfirmationLazy';
import { SignUpLazy } from './pages/SignUp/SignUpLazy';
import { SnackbarUtilsConfigurator } from './components/SnackbarUtilsConfigurator/SnackbarUtilsConfigurator';
import { Transfers } from './pages/Transfers/Transfers';
import { theme } from '@finex/theme';

export const App = observer(() => {
  return (
    <Suspense fallback={<div>loading...</div>}>
      <ThemeProvider theme={theme}>
        <SnackbarProvider
          anchorOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
          autoHideDuration={3000}
          TransitionComponent={Slide}
        >
          <SnackbarUtilsConfigurator />
          <Routes>
            <Route path="/sign-in" element={<SignInLazy />} />
            <Route path="/sign-up" element={<SignUpLazy />} />
            <Route path="/sign-up/confirmation" element={<SignUpConfirmationLazy />} />
            <Route path="/signup/confirm" element={<SignUpConfirmationLazy />} />
            <Route path="/reset-password" element={<ResetPasswordLazy />} />
            <Route path="/reset-password/confirmation" element={<ResetPasswordConfirmationLazy />} />
            <Route path="/password_recovery/confirm" element={<ResetPasswordConfirmationLazy />} />
            <Route
              path="*"
              element={
                <RequireAuth>
                  <MainLayout>
                    <Routes>
                      <Route path="/" element={<Home />} />
                      <Route path="/dashboard" element={<DashboardLazy />} />
                      <Route path="/income-expenses" element={<IncomeExpenseCashFlows />} />
                      <Route path="/income-expenses/transactions" element={<IncomeExpenseTransactions />} />
                      <Route path="/debts" element={<Debts />} />
                      <Route path="/transfers" element={<Transfers />} />
                      <Route path="/exchanges" element={<Exchanges />} />

                      <Route path="/settings" element={<SettingsLazy />} />
                      <Route path="/settings/:tab" element={<SettingsLazy />} />

                      <Route path="*" element={<NotFoundLazy />} />
                    </Routes>
                  </MainLayout>
                </RequireAuth>
              }
            />
          </Routes>
        </SnackbarProvider>
      </ThemeProvider>
    </Suspense>
  );
});
