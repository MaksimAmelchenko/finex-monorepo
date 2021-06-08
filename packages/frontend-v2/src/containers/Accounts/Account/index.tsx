import { h, JSX } from 'preact';

import { getT } from '../../../lib/core/i18n';
import { IAccount } from '../../../types/account';
import { Permit } from '../../../types';

const t = getT('Accounts');

interface IAccountProps {
  account: IAccount;
}

export function Account({ account }: IAccountProps): JSX.Element {
  const { permit, name, user, isEnabled, readers, writers, accountType, note } = account;
  const isOwner = permit === Permit.Owner;
  const isRead = permit === Permit.Read;
  const isWrite = permit === Permit.Write;

  return (
    <tr>
      <td>
        <input type="checkbox" />
      </td>
      <td>{isOwner ? <a href="#"> {name} </a> : name}</td>
      <td>{isEnabled && 'V'}</td>
      <td>{isOwner ? 'Я' : user.name}</td>
      <td>
        {isOwner && readers.map(({ name, id }) => <span key={id}>{name}</span>)}
        {isRead ? 'V' : ''}
      </td>
      <td>
        {isOwner && writers.map(({ name, id }) => <span key={id}> {name}</span>)}
        {isWrite ? 'V' : ''}
      </td>
      <td>{accountType.name}</td>
      <td>{note}</td>
    </tr>
  );
}
