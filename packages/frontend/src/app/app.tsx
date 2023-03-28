import React, { Suspense } from 'react';
import { observer } from 'mobx-react-lite';
import { Route, Routes } from 'react-router-dom';
import { Slide } from '@mui/material';
import { SnackbarProvider } from 'notistack';
import ThemeProvider from '@mui/material/styles/ThemeProvider';

import { theme } from '@finex/theme';
import { GoogleAnalytics } from './components/GoogleAnalytics/GoogleAnalytics';
import { Loader } from './components/Loader/Loader';
import { RequireAuth } from './components/RequireAuth/RequireAuth';
import { SnackbarUtilsConfigurator } from './components/SnackbarUtilsConfigurator/SnackbarUtilsConfigurator';
import { MainLayoutLazy } from './containers/MainLayout/MainLayoutLazy';
import { MainLayoutMobileLazy } from './containers/MainLayoutMobile/MainLayoutMobileLazy';
import { useDeviceSize } from './lib/use-device-size';
import { ResetPasswordLazy } from './pages/ResetPassword/ResetPasswordLazy';
import { ResetPasswordConfirmationLazy } from './pages/ResetPasswordConfirmation/ResetPasswordConfirmationLazy';
import { SignInLazy } from './pages/SignIn/SignInLazy';
import { SignUpLazy } from './pages/SignUp/SignUpLazy';
import { SignUpConfirmationLazy } from './pages/SignUpConfirmation/SignUpConfirmationLazy';

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
              element={<RequireAuth>{isSmall ? <MainLayoutMobileLazy /> : <MainLayoutLazy />}</RequireAuth>}
            />
          </Routes>
        </SnackbarProvider>
      </ThemeProvider>
    </Suspense>
  );
});
