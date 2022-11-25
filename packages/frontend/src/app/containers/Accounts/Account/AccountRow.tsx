import React from 'react';
import clsx from 'clsx';
import { observer } from 'mobx-react-lite';

import { Account } from '../../../stores/models/account';
import { Image, Tag, checkSvg, BaseCheckbox } from '@finex/ui-kit';
import { Permit } from '../../../types';
import { getT } from '../../../lib/core/i18n';

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

  const handleNameClick = (event: React.SyntheticEvent) => {
    onClick(account);
  };

  return (
    <tr className={clsx(isDeleting && 'is_deleting')}>
      <td className="checkboxCell" onClick={handleOnSelect}>
        <BaseCheckbox value={isSelected} />
      </td>
      <td>
        {isOwner ? (
          <span className="name" onClick={handleNameClick}>
            {name}
          </span>
        ) : (
          name
        )}
      </td>
      <td className="tickCell">{isEnabled && <Image src={checkSvg} alt="active" />}</td>
      <td>{isOwner ? t('Me') : user.name}</td>
      <td className={clsx(!isOwner && 'tickCell')}>
        {isOwner && viewers.map(({ name, id }) => <Tag key={id}>{name}</Tag>)}
        {isView ? <Image src={checkSvg} alt="view" /> : ''}
      </td>
      <td className={clsx(!isOwner && 'tickCell')}>
        {isOwner && editors.map(({ name, id }) => <Tag key={id}>{name}</Tag>)}
        {isEdit ? <Image src={checkSvg} alt="edit" /> : ''}
      </td>
      <td>{accountType.name}</td>
      <td>{note}</td>
    </tr>
  );
});
