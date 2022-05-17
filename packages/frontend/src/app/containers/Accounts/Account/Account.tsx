import React from 'react';
import clsx from 'clsx';
import { observer } from 'mobx-react-lite';

import { Account as AccountModel } from '../../../stores/models/account';
import { Checkbox, Image, Tag, TickSvg } from '@finex/ui-kit';
import { Permit } from '../../../types';
import { getT } from '../../../lib/core/i18n';

import styles from './Account.module.scss';

const t = getT('Accounts');

interface AccountProps {
  account: AccountModel;
  onClick: (account: AccountModel) => void;
}

export const Account = observer<AccountProps>(({ account, onClick }: AccountProps) => {
  const { permit, name, user, isEnabled, readers, writers, accountType, note, isSelected, isDeleting } = account;
  const isOwner = permit === Permit.Owner;
  const isRead = permit === Permit.Read;
  const isWrite = permit === Permit.Write;

  const handleOnSelect = () => {
    account.toggleSelection();
  };

  const handleClick = (event: React.SyntheticEvent) => {
    event.stopPropagation();
    event.preventDefault();
    onClick(account);
  };

  return (
    <tr onClick={handleOnSelect} className={clsx(isDeleting && styles.row_is_deleting)}>
      <td>
        <Checkbox value={isSelected} onChange={handleOnSelect} />
      </td>
      <td>
        {isOwner ? (
          <div className={styles.name} onClick={handleClick}>
            {name}
          </div>
        ) : (
          name
        )}
      </td>
      <td className={styles.tick}>{isEnabled && <Image src={TickSvg} alt="active" />}</td>
      <td>{isOwner ? t('Me') : user.name}</td>
      <td className={styles.tick}>
        {isOwner && readers.map(({ name, id }) => <Tag key={id}>{name}</Tag>)}
        {isRead ? <Image src={TickSvg} alt="read" /> : ''}
      </td>
      <td className={styles.tick}>
        {isOwner && writers.map(({ name, id }) => <Tag key={id}>{name}</Tag>)}
        {isWrite ? <Image src={TickSvg} alt="write" /> : ''}
      </td>
      <td>{accountType.name}</td>
      <td>{note}</td>
    </tr>
  );
});
