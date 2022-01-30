import { FC, Suspense } from 'react';
import { Link, Route, Routes } from 'react-router-dom';
import { observer } from 'mobx-react-lite';

import { AccountsLazy } from './containers/Accounts/AccountsLazy';
import { Auth } from './pages/Auth';
import { AuthRepository } from './core/other-stores/auth-repository';
import { DashboardLazy } from './containers/Dashboard/DashboardLazy';
import { Home } from './pages/Home/Home';
import { IncomeExpenseCashFlows } from './containers/IncomeExpenseCashFlows/IncomeExpenseCashFlows';
import { IncomeExpenseTransactions } from './containers/IncomeExpenseTransactions/IncomeExpenseTransactions';
import { NotFoundLazy } from './pages/NotFound/NotFoundLazy';
import { useStore } from './core/hooks/use-store';

const Main: FC = ({ children }) => {
  return <main>{children}</main>;
};

function Aside() {
  return (
    <aside className="scrollable">
      <ul>
        <li>
          <Link to={'/dashboard'}>Dashboard</Link>
        </li>
        <li>
          <Link to={'/cash-flows/income-expenses/transactions'}>Transactions</Link>
        </li>
        <li>
          <Link to={'/settings/accounts'}>Accounts</Link>
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
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/dashboard" element={<DashboardLazy />} />
          <Route path="/cash-flows/income-expenses/transactions" element={<IncomeExpenseTransactions />} />
          <Route path="/cash-flows/income-expenses" element={<IncomeExpenseCashFlows />} />
          <Route path="/settings/accounts" element={<AccountsLazy />} />
          <Route path="*" element={<NotFoundLazy />} />
        </Routes>
      </Main>
    </Suspense>
  );
});
