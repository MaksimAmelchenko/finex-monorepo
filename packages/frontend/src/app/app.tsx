import React, { Suspense, useEffect, useState } from 'react';
import { observer } from 'mobx-react-lite';
import { Route, Routes } from 'react-router-dom';
import { Slide } from '@mui/material';
import { SnackbarProvider } from 'notistack';
import ThemeProvider from '@mui/material/styles/ThemeProvider';

import { theme } from '@finex/theme';
import { CookieConsent } from './containers/CookieConsent/CookieConsent';
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

export const App = observer(() => {
  const { isSmall } = useDeviceSize();
  const [showCookieConsent, setShowCookieConsent] = useState(false);
  const [showOptionsCookieConsent, setShowOptionsCookieConsent] = useState(false);

  useEffect(() => {
    if (!localStorage.getItem('consentMode')) {
      setShowCookieConsent(true);
    }
  }, []);

  return (
    <Suspense fallback={<Loader />}>
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

      {showCookieConsent && (
        <CookieConsent
          consentTypes={['functionality_storage', 'analytics_storage']}
          showOptions={showOptionsCookieConsent}
          onClose={() => setShowCookieConsent(false)}
        />
      )}
    </Suspense>
  );
});
