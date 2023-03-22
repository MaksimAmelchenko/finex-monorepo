import React, { Suspense } from 'react';
import ThemeProvider from '@mui/material/styles/ThemeProvider';
import { Navigate, Route, Routes } from 'react-router-dom';
import { Slide } from '@mui/material';
import { SnackbarProvider } from 'notistack';
import { observer } from 'mobx-react-lite';

import { BillingLazy } from './pages/Billing/BillingLazy';
import { CashFlows } from './pages/CashFlows/CashFlows';
import { DashboardLazy } from './pages/Dashboard/DashboardLazy';
import { Debts } from './pages/Debts/Debts';
import { DebtsMobileLazy } from './pages/DebtsMobile/DebtsMobileLazy';
import { DistributionReportLazy } from './pages/Reports/DistributionReport/DistributionReportLazy';
import { DynamicsReportLazy } from './pages/Reports/DynamicsReport/DynamicsReportLazy';
import { Exchanges } from './pages/Exchanges/Exchanges';
import { GoogleAnalytics } from './components/GoogleAnalytics/GoogleAnalytics';
import { Loader } from './components/Loader/Loader';
import { MainLayout } from './containers/MainLayout/MainLayout';
import { MainLayoutMobile } from './containers/MainLayoutMobile/MainLayoutMobile';
import { OperationsLazy } from './pages/Operations/OperationsLazy';
import { OutcomeMobileLazy } from './pages/OutcomeMobile/OutcomeMobileLazy';
import { PlanningLazy } from './pages/Planning/PlanningLazy';
import { PlanningMobileLazy } from './pages/PlanningMobile/PlanningMobileLazy';
import { ProfileLazy } from './pages/Profile/ProfileLazy';
import { RequireAuth } from './components/RequireAuth/RequireAuth';
import { ResetPasswordConfirmationLazy } from './pages/ResetPasswordConfirmation/ResetPasswordConfirmationLazy';
import { ResetPasswordLazy } from './pages/ResetPassword/ResetPasswordLazy';
import { SettingsLazy } from './pages/Settings/SettingsLazy';
import { SignInLazy } from './pages/SignIn/SignInLazy';
import { SignUpConfirmationLazy } from './pages/SignUpConfirmation/SignUpConfirmationLazy';
import { SignUpLazy } from './pages/SignUp/SignUpLazy';
import { SnackbarUtilsConfigurator } from './components/SnackbarUtilsConfigurator/SnackbarUtilsConfigurator';
import { ToolsLazy } from './pages/Tools/ToolsLazy';
import { Transactions } from './pages/Transactions/Transactions';
import { Transfers } from './pages/Transfers/Transfers';
import { theme } from '@finex/theme';
import { useDeviceSize } from './lib/use-device-size';

const TRACKING_ID = process.env.NX_TRACKING_ID;

export const App = observer(() => {
  const { isSmall } = useDeviceSize();

  return (
    <Suspense fallback={<Loader />}>
      {TRACKING_ID && <GoogleAnalytics trackingId={TRACKING_ID} />}
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
            <Route path="/reset-password" element={<ResetPasswordLazy />} />
            <Route path="/reset-password/confirmation" element={<ResetPasswordConfirmationLazy />} />
            <Route
              path="*"
              element={
                <RequireAuth>
                  {isSmall ? (
                    <MainLayoutMobile>
                      <Routes>
                        <Route path="/outcome" element={<OutcomeMobileLazy />} />
                        <Route path="/operations" element={<OperationsLazy />} />
                        <Route path="/debts" element={<DebtsMobileLazy />} />
                        <Route path="/planning" element={<PlanningMobileLazy />} />
                        <Route path="*" element={<Navigate to="/operations" />} />
                      </Routes>
                    </MainLayoutMobile>
                  ) : (
                    <MainLayout>
                      <Routes>
                        <Route path="/outcome" element={<DashboardLazy />} />
                        <Route path="/cash-flows" element={<CashFlows />} />
                        <Route path="/transactions" element={<Transactions />} />
                        <Route path="/debts" element={<Debts />} />
                        <Route path="/transfers" element={<Transfers />} />
                        <Route path="/exchanges" element={<Exchanges />} />
                        <Route path="/planning" element={<PlanningLazy />} />
                        <Route path="/reports" element={<Navigate to={'/reports/dynamics'} replace={true} />} />
                        <Route path="/reports/dynamics" element={<DynamicsReportLazy />} />
                        <Route path="/reports/distribution" element={<DistributionReportLazy />} />

                        <Route path="/settings/billing" element={<BillingLazy />} />

                        <Route path="/settings" element={<SettingsLazy />} />
                        <Route path="/settings/:tab" element={<SettingsLazy />} />

                        <Route path="/profile" element={<ProfileLazy />} />
                        <Route path="/tools" element={<ToolsLazy />} />

                        <Route path="*" element={<Navigate to="/transactions" />} />
                      </Routes>
                    </MainLayout>
                  )}
                </RequireAuth>
              }
            />
          </Routes>
        </SnackbarProvider>
      </ThemeProvider>
    </Suspense>
  );
});
