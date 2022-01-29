import { FunctionComponent, h } from 'preact';
import { Suspense } from 'preact/compat';
import { Link, Route, Router } from 'preact-router';
import { observer } from 'mobx-react-lite';

import { Home } from './pages/Home';
import { NotFound } from './pages/NotFound';
import { useStore } from './core/hooks/use-store';
import { AuthRepository } from './core/other-stores/auth-repository';
import { Auth } from './pages/Auth';
import { Accounts } from './containers/Accounts';
import { IncomeExpenseTransactions } from './containers/IncomeExpenseTransactions';
import { IncomeExpenseCashFlows } from './containers/IncomeExpenseCashFlows';
import { Dashboard } from './containers/Dashboard';

const Main: FunctionComponent = ({ children }) => {
  return <main>{children}</main>;
};

function Aside() {
  return (
    <aside class="scrollable">
      <ul>
        <li>
          <Link href={'/dashboard'}>Dashboard</Link>
        </li>
        <li>
          <Link href={'/cash-flows/income-expenses/transactions'}>Transactions</Link>
        </li>
        <li>
          <Link href={'/settings/accounts'}>Accounts</Link>
        </li>
      </ul>
    </aside>
  );
}

export const App = observer(() => {
  const authRepository = useStore(AuthRepository);

  if (!authRepository.hasAuth) {
    return <Auth />;
  }

  return (
    <Suspense fallback={<div>loading...</div>}>
      <Aside />
      <Main>
        <Router>
          <Route path="/" component={Home} />
          <Route path="/dashboard" component={Dashboard} />
          <Route path="/cash-flows/income-expenses/transactions" component={IncomeExpenseTransactions} />
          <Route path="/cash-flows/income-expenses" component={IncomeExpenseCashFlows} />
          <Route path="/settings/accounts" component={Accounts} />
          <NotFound default />
        </Router>
      </Main>
    </Suspense>
  );
});
