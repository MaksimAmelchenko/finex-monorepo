import React from 'react';
import { observer } from 'mobx-react-lite';

import { Account } from './Account/Account';
import { AccountsRepository } from '../../stores/accounts-repository';
import { getT } from '../../lib/core/i18n';
import { useStore } from '../../core/hooks/use-store';

const t = getT('Accounts');

export const Accounts = observer(() => {
  const accountsRepository = useStore(AccountsRepository);
  const { accounts } = accountsRepository;
  return (
    <article>
      <table width="100%">
        <thead>
          <tr>
            <th rowSpan={2} />
            <th rowSpan={2}>Название</th>
            <th rowSpan={2}>Активный</th>
            <th rowSpan={2}>Владелец</th>
            <th colSpan={2}>Права доступа</th>
            <th rowSpan={2}>Тип счета</th>
            <th rowSpan={2}>Примечание</th>
          </tr>
          <tr>
            <th>Просмотр</th>
            <th>Изменение</th>
          </tr>
        </thead>
        <tbody>
          {accounts.map(account => {
            return <Account account={account} key={account.id} />;
          })}
        </tbody>
      </table>
    </article>
  );
});

export default Accounts;
