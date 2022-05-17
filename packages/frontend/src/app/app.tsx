import React, { Suspense } from 'react';
import ThemeProvider from '@mui/material/styles/ThemeProvider';
import { Route, Routes } from 'react-router-dom';
import { observer } from 'mobx-react-lite';

import { AccountsLazy } from './containers/Accounts/AccountsLazy';
import { DashboardLazy } from './containers/Dashboard/DashboardLazy';
import { Home } from './pages/Home/Home';
import { IncomeExpenseCashFlows } from './containers/IncomeExpenseCashFlows/IncomeExpenseCashFlows';
import { IncomeExpenseTransactions } from './pages/IncomeExpenseTransactions/IncomeExpenseTransactions';
import { MainLayout } from './containers/MainLayout/MainLayout';
import { NotFoundLazy } from './pages/NotFound/NotFoundLazy';
import { RequireAuth } from './components/RequireAuth/RequireAuth';
import { ResetPasswordConfirmationLazy } from './pages/ResetPasswordConfirmation/ResetPasswordConfirmationLazy';
import { ResetPasswordLazy } from './pages/ResetPassword/ResetPasswordLazy';
import { SignInLazy } from './pages/SignIn/SignInLazy';
import { SignUpConfirmationLazy } from './pages/SignUpConfirmation/SignUpConfirmationLazy';
import { SignUpLazy } from './pages/SignUp/SignUpLazy';
import { theme } from '@finex/theme';

export const App = observer(() => {
  return (
    <Suspense fallback={<div>loading...</div>}>
      <ThemeProvider theme={theme}>
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
                    <Route path="/cash-flows/income-expenses" element={<IncomeExpenseCashFlows />} />
                    <Route path="/cash-flows/income-expenses/transactions" element={<IncomeExpenseTransactions />} />
                    <Route path="/cash-flows/debts" element={<div>Debts</div>} />
                    <Route path="/cash-flows/transfers" element={<div>Transfers</div>} />
                    <Route path="/cash-flows/exchanges" element={<div>Exchanges</div>} />

                    <Route path="/settings/accounts" element={<AccountsLazy />} />

                    <Route path="*" element={<NotFoundLazy />} />
                  </Routes>
                </MainLayout>
              </RequireAuth>
            }
          />
        </Routes>
      </ThemeProvider>
    </Suspense>
  );
});
