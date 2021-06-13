import { h } from 'preact';
import { observer } from 'mobx-react-lite';
import { Link } from 'preact-router';

import style from './style.css';
import LogoIcon from '../../icons/LogoIcon.svg';

export const Home = observer(() => {
  return (
    <div class={style.home}>
      <h1>Home</h1>
      <div>
        <LogoIcon />
      </div>
      <ul>
        <li>
          <Link href={'/cash-flows/income-expenses/transactions'}>Transactions</Link>
        </li>
        <li>
          <Link href={'/settings/accounts'}>Accounts</Link>
        </li>
      </ul>
    </div>
  );
});
