import React from 'react';
import clsx from 'clsx';
import { observer } from 'mobx-react-lite';

import { Account } from '../../../stores/models/account';
import { BaseCheckbox, Image, Tag, TickSvg } from '@finex/ui-kit';
import { Permit } from '../../../types';
import { getT } from '../../../lib/core/i18n';

import styles from './AccountRow.module.scss';

const t = getT('Accounts');

interface AccountProps {
  account: Account;
  onClick: (account: Account) => void;
}

export const AccountRow = observer<AccountProps>(({ account, onClick }: AccountProps) => {
  const { permit, name, user, isEnabled, viewers, editors, accountType, note, isSelected, isDeleting } = account;
  const isOwner = permit === Permit.Owner;
  const isView = permit === Permit.View;
  const isEdit = permit === Permit.Edit;

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
        <BaseCheckbox value={isSelected} />
      </td>
      <td>
        {isOwner ? (
          <span className={styles.name} onClick={handleClick}>
            {name}
          </span>
        ) : (
          name
        )}
      </td>
      <td className={styles.tick}>{isEnabled && <Image src={TickSvg} alt="active" />}</td>
      <td>{isOwner ? t('Me') : user.name}</td>
      <td className={styles.tick}>
        {isOwner && viewers.map(({ name, id }) => <Tag key={id}>{name}</Tag>)}
        {isView ? <Image src={TickSvg} alt="view" /> : ''}
      </td>
      <td className={styles.tick}>
        {isOwner && editors.map(({ name, id }) => <Tag key={id}>{name}</Tag>)}
        {isEdit ? <Image src={TickSvg} alt="edit" /> : ''}
      </td>
      <td>{accountType.name}</td>
      <td>{note}</td>
    </tr>
  );
});
