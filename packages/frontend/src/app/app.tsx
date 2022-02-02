import { FC, Suspense } from 'react';
import { Link, Route, Routes } from 'react-router-dom';
import { observer } from 'mobx-react-lite';

import { AccountsLazy } from './containers/Accounts/AccountsLazy';
import { DashboardLazy } from './containers/Dashboard/DashboardLazy';
import { Home } from './pages/Home/Home';
import { IncomeExpenseCashFlows } from './containers/IncomeExpenseCashFlows/IncomeExpenseCashFlows';
import { IncomeExpenseTransactions } from './containers/IncomeExpenseTransactions/IncomeExpenseTransactions';
import { NotFoundLazy } from './pages/NotFound/NotFoundLazy';
import { RequireAuth } from './components/RequireAuth/RequireAuth';
import { SignInLazy } from './pages/Auth/SignInLazy';
import { SignUpLazy } from './pages/SignUp/SignUpLazy';

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
  return (
    <Suspense fallback={<div>loading...</div>}>
      <Routes>
        <Route path="/sign-in" element={<SignInLazy />} />
        <Route path="/sign-up" element={<SignUpLazy />} />
        <Route
          path="*"
          element={
            <RequireAuth>
              <>
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
              </>
            </RequireAuth>
          }
        />
      </Routes>
    </Suspense>
  );
});
