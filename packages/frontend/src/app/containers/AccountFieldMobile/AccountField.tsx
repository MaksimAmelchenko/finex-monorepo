import React, { forwardRef, useCallback, useMemo, useState } from 'react';
import { useField, useFormikContext } from 'formik';

import { Account } from '../../stores/models/account';
import { AccountsMobile } from '../AccountsMobile/AccountsMobile_';
import { AccountsRepository } from '../../stores/accounts-repository';
import { Dropdown, Input } from '@finex/ui-kit';
import { IFormInputProps } from '../../components/Form';
import { useStore } from '../../core/hooks/use-store';

interface AccountFieldProps extends Omit<IFormInputProps, 'endAdornment'> {}

export const AccountField = forwardRef<HTMLInputElement, AccountFieldProps>(({ name, ...props }, ref) => {
  const categoriesRepository = useStore(AccountsRepository);

  const [openAccounts, setOpenAccounts] = useState<boolean>(false);

  const { setFieldValue, setFieldTouched } = useFormikContext<any>();
  const [{ value: accountId }, meta] = useField(name);

  const account = useMemo(() => categoriesRepository.get(accountId), [accountId]);

  const handleAccountDropdownClick = useCallback(() => {
    setOpenAccounts(true);
  }, []);

  const handleAccountSelect = useCallback(
    (account: Account) => {
      setFieldValue(name, account.id);
      setFieldTouched(name, true, false);
      setOpenAccounts(false);
    },
    [name]
  );

  const handleAccountsClose = useCallback(() => {
    setOpenAccounts(false);
  }, []);

  return (
    <>
      <Input
        {...props}
        value={account?.name ?? ''}
        readOnly
        errorText={meta.error}
        endAdornment={<Dropdown onClick={handleAccountDropdownClick} />}
        onClick={handleAccountDropdownClick}
        ref={ref}
      />

      <AccountsMobile open={openAccounts} onSelect={handleAccountSelect} onClose={handleAccountsClose} />
    </>
  );
});
