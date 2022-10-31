import React, { useCallback, useMemo } from 'react';
import * as Yup from 'yup';
import { FormikHelpers } from 'formik';
import { useSnackbar } from 'notistack';

import { Account } from '../../stores/models/account';
import { AccountTypesStore } from '../../stores/account-types-store';
import { AccountsRepository } from '../../stores/accounts-repository';
import { CreateAccountData, IAccount, UpdateAccountChanges } from '../../types/account';
import {
  Form,
  FormBody,
  FormButton,
  FormCheckbox,
  FormFieldSet,
  FormFooter,
  FormHeader,
  FormSelect,
  FormTextAreaField,
  FormTextField,
} from '../../components/Form';
import { ISelectOption } from '@finex/ui-kit';
import { ProfileRepository } from '../../stores/profile-repository';
import { Shape } from '../../types';
import { UsersRepository } from '../../stores/users-repository';
import { getPatch } from '../../lib/core/get-patch';
import { getT } from '../../lib/core/i18n';
import { useStore } from '../../core/hooks/use-store';

interface AccountFormValues {
  name: string;
  accountTypeId: string;
  isEnabled: boolean;
  note: string;
  viewers: string[];
  editors: string[];
}

interface AccountWindowProps {
  account: Partial<IAccount> | Account;
  onClose: () => unknown;
}

const t = getT('AccountWindow');

function mapValuesToCreatePayload({
  name,
  accountTypeId,
  isEnabled,
  note,
  viewers,
  editors,
}: AccountFormValues): CreateAccountData {
  return {
    name,
    accountTypeId,
    isEnabled,
    note,
    viewers,
    editors,
  };
}

function mapValuesToUpdatePayload({
  name,
  accountTypeId,
  isEnabled,
  note,
  viewers,
  editors,
}: AccountFormValues): UpdateAccountChanges {
  return {
    name,
    accountTypeId,
    isEnabled,
    note,
    viewers,
    editors,
  };
}

export function AccountWindow({ account, onClose }: AccountWindowProps): JSX.Element {
  const accountTypesStore = useStore(AccountTypesStore);
  const accountsRepository = useStore(AccountsRepository);
  const profileRepository = useStore(ProfileRepository);
  const usersRepository = useStore(UsersRepository);
  const { enqueueSnackbar } = useSnackbar();

  const nameFieldRefCallback = useCallback((node: HTMLInputElement | null) => {
    if (node) {
      node.focus();
    }
  }, []);

  const onSubmit = useCallback(
    (values: AccountFormValues, _: FormikHelpers<AccountFormValues>, initialValues: AccountFormValues) => {
      let result: Promise<unknown>;
      if (account instanceof Account) {
        const changes: UpdateAccountChanges = getPatch(
          mapValuesToUpdatePayload(initialValues),
          mapValuesToUpdatePayload(values)
        );
        result = accountsRepository.updateAccount(account, changes);
      } else {
        const data: CreateAccountData = mapValuesToCreatePayload(values);
        result = accountsRepository.createAccount(account, data);
      }

      return result
        .then(() => {
          onClose();
        })
        .catch(err => {
          let message = '';
          switch (err.code) {
            default:
              message = err.message;
          }
          enqueueSnackbar(message, { variant: 'error' });
        });
    },
    [account, accountsRepository, enqueueSnackbar, onClose]
  );

  const validationSchema = useMemo(
    () =>
      Yup.object<Shape<AccountFormValues>>({
        name: Yup.string().required('Please fill name'),
      }),
    []
  );

  const selectAccountTypesOptions = useMemo<ISelectOption[]>(() => {
    return accountTypesStore.accountTypes.map(({ id: value, name: label }) => ({ value, label }));
  }, [accountTypesStore.accountTypes]);

  const selectUsersOptions = useMemo<ISelectOption[]>(() => {
    return usersRepository.users
      .filter(({ id }) => id !== profileRepository.profile!.user.id)
      .map(({ id: value, name: label }) => ({ value, label }));
  }, [profileRepository.profile, usersRepository.users]);

  const { name, accountType, isEnabled, note, viewers, editors } = account;

  return (
    <Form<AccountFormValues>
      onSubmit={onSubmit}
      initialValues={{
        name: name ?? '',
        accountTypeId: accountType?.id ?? accountTypesStore.accountTypes[0].id,
        isEnabled: isEnabled ?? true,
        note: note ?? '',
        viewers: viewers?.map(({ id }) => id) ?? [],
        editors: editors?.map(({ id }) => id) ?? [],
      }}
      validationSchema={validationSchema}
    >
      <FormHeader title={account instanceof Account ? t('Edit account') : t('Add new account')} onClose={onClose} />

      <FormBody>
        <FormTextField name="name" label={t('Name')} ref={nameFieldRefCallback} />
        <FormSelect
          name="accountTypeId"
          label={t('Account type')}
          options={selectAccountTypesOptions}
          // tabIndex={2}
        />
        <FormCheckbox
          name="isEnabled"
          helperText={t('Inactive accounts are hidden when creating or editing a transaction')}
        >
          {t('Active')}
        </FormCheckbox>
        <FormTextAreaField name="note" label={t('Note')} />
        {/*<FormSelect isMulti name="tagIds" label={t('Tags')} options={selectTagsOptions} />*/}
        <FormFieldSet legend={t('Permissions')}>
          <FormSelect
            name="viewers"
            isMulti
            label={t('View')}
            options={selectUsersOptions}
            helperText={t('List of users who have the right to view transactions on this account')}
          />
          <FormSelect
            name="editors"
            isMulti
            label={t('Edit')}
            options={selectUsersOptions}
            helperText={t('List of users who have the right to add, edit and delete transactions on this account')}
          />
        </FormFieldSet>
      </FormBody>

      <FormFooter>
        <FormButton variant="outlined" isIgnoreValidation onClick={onClose}>
          {t('Cancel')}
        </FormButton>
        <FormButton type="submit" color="primary" isIgnoreValidation>
          {t('Save')}
        </FormButton>
      </FormFooter>
    </Form>
  );
}
