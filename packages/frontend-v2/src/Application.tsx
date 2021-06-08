import { FunctionComponent, h } from 'preact';
import { Suspense } from 'preact/compat';
import { Route, Router } from 'preact-router';
import { observer } from 'mobx-react-lite';

import { Home } from './pages/Home';
import { NotFound } from './pages/NotFound';
import { Header } from './components/Header';
import { useStore } from './core/hooks/use-store';
import { AuthRepository } from './core/other-stores/auth-repository';
import { Auth } from './pages/Auth';
import { AccountsLazy } from './containers/Accounts/lazy';

const Layout: FunctionComponent = ({ children }) => {
  return <main style={{ marginTop: '100px' }}>{children}</main>;
};

export const App = observer(() => {
  const authRepository = useStore(AuthRepository);

  if (!authRepository.hasAuth) {
    return <Auth />;
  }

  return (
    <div>
      <Suspense fallback={<div>loading...</div>}>
        <Header />
        <Layout>
          <Router>
            <Route path="/" component={Home} />
            <Route path="/settings/accounts" component={AccountsLazy} />
            <NotFound default />
          </Router>
        </Layout>
      </Suspense>
    </div>
  );
});
