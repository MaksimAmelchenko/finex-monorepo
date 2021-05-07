import { h } from 'preact';
import { Suspense } from 'preact/compat';
import { Route, Router } from 'preact-router';
import { observer } from 'mobx-react-lite';

import { Home } from './pages/Home';
import { ProfileLazy } from './pages/Profile/lazy';
import { NotFound } from './pages/NotFound';
import { Header } from './components/Header';
import { useStore } from './core/hooks/use-store';
import { AuthRepository } from './core/other-stores/auth-repository';
import { Auth } from './pages/Auth';

export const App = observer(() => {
  const authRepository = useStore(AuthRepository);
  console.log('RENDER');
  if (!authRepository.hasAuth) {
    return <Auth />;
  }

  return (
    <div>
      <Suspense fallback={<div>loading...</div>}>
        <Header />
        <Router>
          <Route path="/" component={Home} />
          <Route path="/profile/" component={ProfileLazy} user="me" />
          <NotFound default />
        </Router>
      </Suspense>
    </div>
  );
});
