import React, { useCallback, useMemo, useRef } from 'react';
import * as Yup from 'yup';
import { FormikHelpers } from 'formik';
import { useSnackbar } from 'notistack';

import { Account } from '../../stores/models/account';
import { AccountTypesStore } from '../../stores/account-types-store';
import { AccountsRepository } from '../../stores/accounts-repository';
import { CreateAccountData, IAccount, UpdateAccountChanges } from '../../types/account';
import { Drawer } from '../../components/Drawer/Drawer';
import { DrawerFooter } from '../../components/Drawer/DrawerFooter';
import { Form, FormButton, FormCheckbox, FormLayout, FormTextField } from '../../components/Form';
import { FormFieldSet } from '../../components/Form/FormFieldSet/FormFieldSet';
import { FormSelect } from '../../components/Form/FormSelect/FormSelect';
import { FormTextAreaField } from '../../components/Form/FormTextArea/FormTextField';
import { ISelectOption } from '@finex/ui-kit';
import { ProfileRepository } from '../../stores/profile-repository';
import { Shape } from '../../types';
import { UsersRepository } from '../../stores/users-repository';
import { getPatch } from '../../lib/core/get-path';
import { getT } from '../../lib/core/i18n';
import { useStore } from '../../core/hooks/use-store';

import styles from './AccountWindow.module.scss';

interface AccountFormValues {
  name: string;
  accountTypeId: string;
  isEnabled: boolean;
  note: string;
  readers: string[];
  writers: string[];
}

interface AccountWindowProps {
  isOpened: boolean;
  account: Partial<IAccount> | Account;
  onClose: () => unknown;
}

const t = getT('AccountWindow');

function mapValuesToCreatePayload({
  name,
  accountTypeId,
  isEnabled,
  note,
  readers,
  writers,
}: AccountFormValues): CreateAccountData {
  return {
    name,
    accountTypeId,
    isEnabled,
    note,
    readers,
    writers,
  };
}

function mapValuesToUpdatePayload({
  name,
  accountTypeId,
  isEnabled,
  note,
  readers,
  writers,
}: AccountFormValues): CreateAccountData {
  return {
    name,
    accountTypeId,
    isEnabled,
    note,
    readers,
    writers,
  };
}

export function AccountWindow({ isOpened, account, onClose }: AccountWindowProps): JSX.Element {
  const accountTypesStore = useStore(AccountTypesStore);
  const accountsRepository = useStore(AccountsRepository);
  const profileRepository = useStore(ProfileRepository);
  const usersRepository = useStore(UsersRepository);
  const { enqueueSnackbar } = useSnackbar();

  const nameFieldRef = useRef<HTMLInputElement | null>(null);

  const handleOnOpen = useCallback(() => {
    nameFieldRef.current?.focus();
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
          let message: string = '';
          switch (err.code) {
            default:
              message = err.data.message;
          }
          enqueueSnackbar(message, { variant: 'error' });
        });
    },
    [accountsRepository, onClose, account]
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
  }, [usersRepository.users]);

  const { name, accountType, isEnabled, note, readers, writers } = account;

  return (
    <Drawer
      isOpened={isOpened}
      title={account instanceof Account ? t('Edit account') : t('Add new account')}
      onClose={onClose}
      onOpen={handleOnOpen}
    >
      <Form<AccountFormValues>
        onSubmit={onSubmit}
        initialValues={{
          name: name ?? '',
          accountTypeId: accountType?.id ?? accountTypesStore.accountTypes[0].id,
          isEnabled: isEnabled ?? true,
          note: note ?? '',
          readers: readers?.map(({ id }) => id) ?? [],
          writers: writers?.map(({ id }) => id) ?? [],
        }}
        validationSchema={validationSchema}
        className={styles.form}
      >
        <div className={styles.form__bodyWrapper}>
          <FormLayout className={styles.form__body}>
            <FormTextField name="name" label={t('Name')} ref={nameFieldRef} />
            <FormSelect
              name="accountTypeId"
              label={t('Account type')}
              options={selectAccountTypesOptions}
              // tabIndex={2}
            />
            <FormCheckbox
              name="isEnabled"
              label={t('Active')}
              helperText={t('Inactive accounts are hidden when creating or editing a transaction')}
            />
            <FormTextAreaField name="note" label={t('Note')} />
            {/*<FormSelect isMulti name="tagIds" label={t('Tags')} options={selectTagsOptions} />*/}
            <FormFieldSet legend={t('Access rights')}>
              <FormSelect
                name="readers"
                isMulti
                label={t('Read')}
                options={selectUsersOptions}
                helperText={t('List of users who have the right to view transactions on this account')}
              />
              <FormSelect
                name="writers"
                isMulti
                label={t('Write')}
                options={selectUsersOptions}
                helperText={t('List of users who have the right to add, edit and delete transactions on this account')}
              />
            </FormFieldSet>
          </FormLayout>
        </div>
        <DrawerFooter className={styles.footer}>
          <FormButton variant="outlined" isIgnoreValidation onClick={onClose}>
            {t('Cancel')}
          </FormButton>
          <FormButton type="submit" color="secondary" isIgnoreValidation>
            {t('Save')}
          </FormButton>
        </DrawerFooter>
      </Form>
    </Drawer>
  );
}
