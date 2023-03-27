import React, { useCallback, useEffect, useMemo } from 'react';
import * as Yup from 'yup';
import { FormikHelpers } from 'formik';
import { useSnackbar } from 'notistack';

import { Account } from '../../stores/models/account';
import { AccountTypesStore } from '../../stores/account-types-store';
import { AccountsRepository } from '../../stores/accounts-repository';
import { BackButton, DeleteButton, Header } from '../../components/Header/Header';
import { CreateAccountData, IAccount, UpdateAccountChanges } from '../../types/account';
import { Form, FormBody, FormButton, FormCheckbox, FormInput } from '../../components/Form';
import { FormSelectNative } from '../../components/Form/FormSelectNative/FormSelectNative';
import { FormTextAreaField } from '../../components/Form/FormTextArea2/FormTextArea';
import { IOption } from '@finex/ui-kit';
import { Shape } from '../../types';
import { analytics } from '../../lib/analytics';
import { getPatch } from '../../lib/core/get-patch';
import { getT } from '../../lib/core/i18n';
import { useStore } from '../../core/hooks/use-store';

import styles from './AccountWindowMobile.module.scss';

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

export function AccountWindowMobile({ account, onClose }: AccountWindowProps): JSX.Element {
  const accountTypesStore = useStore(AccountTypesStore);
  const accountsRepository = useStore(AccountsRepository);

  const { enqueueSnackbar } = useSnackbar();

  const isNew = !(account instanceof Account);

  useEffect(() => {
    analytics.view({
      page_title: 'account-mobile',
    });
  }, []);

  const nameFieldRefCallback = useCallback((node: HTMLInputElement | null) => {
    if (node) {
      // node.focus();
      requestAnimationFrame(() => node.focus());
    }
  }, []);

  const onSubmit = useCallback(
    (values: AccountFormValues, _: FormikHelpers<AccountFormValues>, initialValues: AccountFormValues) => {
      let result: Promise<unknown>;
      if (isNew) {
        const data: CreateAccountData = mapValuesToCreatePayload(values);
        result = accountsRepository.createAccount(account, data);
      } else {
        const changes: UpdateAccountChanges = getPatch(
          mapValuesToUpdatePayload(initialValues),
          mapValuesToUpdatePayload(values)
        );
        result = accountsRepository.updateAccount(account, changes);
      }
      return result
        .then(() => {
          onClose();
        })
        .catch(err => {
          let message = '';
          switch (err.code) {
            case 'account_id_project_name_u':
              message = t('Account already exists');
              break;
            default:
              message = err.message;
          }
          enqueueSnackbar(message, { variant: 'error' });
        });
    },
    [account, accountsRepository, enqueueSnackbar, isNew, onClose]
  );

  const handleDeleteClick = () => {
    accountsRepository
      .deleteAccount(account as Account)
      .then(() => {
        onClose();
      })
      .catch(err => {
        let message = '';
        switch (err.code) {
          case 'cashflow_detail_2_account': {
            message = t('There are transactions on this account');
            break;
          }
          default:
            message = err.message;
        }
        enqueueSnackbar(message, { variant: 'error' });
      });
  };

  const validationSchema = useMemo(
    () =>
      Yup.object<Shape<AccountFormValues>>({
        name: Yup.string().required(t('Please fill name')),
      }),
    []
  );

  const selectAccountTypesOptions = useMemo<IOption[]>(() => {
    return accountTypesStore.accountTypes.map(({ id: value, name: label }) => ({ value, label }));
  }, [accountTypesStore.accountTypes]);

  /*
  const selectUsersOptions = useMemo<ISelectOption[]>(() => {
    return usersRepository.users
      .filter(({ id }) => id !== profileRepository.profile!.user.id)
      .map(({ id: value, name: label }) => ({ value, label }));
  }, [profileRepository.profile, usersRepository.users]);
  */

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
      name="account-mobile"
    >
      <Header
        title={isNew ? t('Add new account') : t('Edit account')}
        startAdornment={<BackButton onClick={onClose} />}
        endAdornment={!isNew && <DeleteButton onClick={handleDeleteClick} />}
      />
      <FormBody className={styles.main}>
        <FormInput name="name" label={t('Name')} ref={nameFieldRefCallback} autoComplete="off" />
        <FormSelectNative name="accountTypeId" label={t('Account type')} options={selectAccountTypesOptions} />
        <FormCheckbox
          name="isEnabled"
          helperText={t('Inactive accounts are hidden when creating or editing a transaction')}
        >
          {t('Active')}
        </FormCheckbox>
        <FormTextAreaField name="note" label={t('Note')} />

        {/*
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
        */}
      </FormBody>

      <footer className={styles.footer}>
        <FormButton type="submit" color="primary" isIgnoreValidation>
          {t('Save')}
        </FormButton>
      </footer>
    </Form>
  );
}
