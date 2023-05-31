import React, { useCallback, useEffect, useMemo, useState } from 'react';
import * as Yup from 'yup';
import { format, parseISO } from 'date-fns';
import { observer } from 'mobx-react-lite';
import { useSnackbar } from 'notistack';

import { AccountField } from '../../../containers/AccountFieldMobile/AccountField';
import { BackButton, Header } from '../../../components/Header/Header';
import { ConnectionsRepository } from '../../../stores/connections-repository';
import { DateField } from '../../../components/DateField/DateField';
import { Form, FormBody } from '../../../components/Form';
import { IAccount, UpdateConnectionAccountChanges } from '../../../types/connections';
import { Button, Input, LingBroken01Icon } from '@finex/ui-kit';
import { SaveButton } from '../../../components/FormSaveButton/FormSaveButton';
import { Shape } from '../../../types';
import { UpdateTransactionChanges } from '../../../types/transaction';
import { analytics } from '../../../lib/analytics';
import { getPatch } from '../../../lib/core/get-patch';
import { getT } from '../../../lib/core/i18n';
import { useStore } from '../../../core/hooks/use-store';

import styles from './ConnectionAccountWindow.module.scss';

interface ConnectionAccountFormValues {
  accountId: string | null;
  syncFrom: Date | null;
}

interface ConnectionAccountWindowProps {
  connectionId: string;
  account: IAccount;
  onClose: () => void;
}

function mapValuesToUpdatePayload(values: ConnectionAccountFormValues): UpdateConnectionAccountChanges {
  const { accountId, syncFrom } = values;
  return {
    accountId,
    syncFrom: syncFrom ? format(syncFrom!, 'yyyy-MM-dd') : null,
  };
}

const t = getT('ConnectionAccountWindow');

export const ConnectionAccountWindow = observer<ConnectionAccountWindowProps>(
  ({ connectionId, account: connectionAccount, onClose }) => {
    const connectionsRepository = useStore(ConnectionsRepository);

    const [isSyncing, setIsSyncing] = useState(false);

    const { enqueueSnackbar } = useSnackbar();

    useEffect(() => {
      analytics.view({
        page_title: 'connection-account-mobile',
      });
    }, []);

    const onSubmit = useCallback(
      (values: ConnectionAccountFormValues) => {
        const { account, syncFrom } = connectionAccount;
        const changes: UpdateTransactionChanges = getPatch(
          mapValuesToUpdatePayload({
            accountId: account?.id ?? null,
            syncFrom: syncFrom ? parseISO(syncFrom) : null,
          }),
          mapValuesToUpdatePayload(values)
        );

        return connectionsRepository
          .updateConnectionAccount(connectionId, connectionAccount.id, changes)
          .then(() => onClose())
          .catch(err => {
            let message = '';
            switch (err.code) {
              case 'account_account_u':
                message = t('The account is already linked. Please choose another account or unlink this one first.');
                break;

              default:
                message = err.message;
            }
            enqueueSnackbar(message, { variant: 'error' });
          });
      },
      [connectionAccount, connectionId, connectionsRepository, enqueueSnackbar, onClose]
    );

    const handleUnlinkClick = () => {
      return connectionsRepository
        .unlinkConnectionAccount(connectionId, connectionAccount.id)
        .then(() => onClose())
        .catch(err => {
          let message = '';
          switch (err.code) {
            default:
              message = err.message;
          }
          enqueueSnackbar(message, { variant: 'error' });
        });
    };
    const handleSyncNowClick = () => {
      setIsSyncing(true);
      return connectionsRepository
        .syncConnectionAccount(connectionId, connectionAccount.id)
        .then(() => {
          enqueueSnackbar(t('Syncing is finished'), { variant: 'success' });
        })
        .catch(err => {
          let message = '';
          switch (err.code) {
            default:
              message = err.message;
          }
          enqueueSnackbar(message, { variant: 'error' });
        })
        .finally(() => {
          setIsSyncing(false);
        });
    };

    const validationSchema = useMemo(
      () =>
        Yup.object<Shape<ConnectionAccountFormValues>>({
          accountId: Yup.mixed().test('accountId', t('Please select account'), value => Boolean(value)),
          syncFrom: Yup.date().required(t('Please select date')),
        }),
      []
    );

    const { providerAccountName, providerAccountProduct, account, syncFrom } = connectionAccount;
    return (
      <Form<ConnectionAccountFormValues>
        onSubmit={onSubmit}
        initialValues={{
          accountId: account?.id ?? null,
          syncFrom: syncFrom ? parseISO(syncFrom) : new Date(),
        }}
        validationSchema={validationSchema}
        name="connection-account-mobile"
      >
        <Header
          title={t('Link accounts')}
          startAdornment={<BackButton onClick={onClose} />}
          endAdornment={account && <UnlinkButton onClick={handleUnlinkClick} />}
        />
        <FormBody className={styles.main}>
          <Input
            label={t('Bank account')}
            value={`${providerAccountName} ${providerAccountProduct ? ` [${providerAccountProduct}]` : ''}`}
            readOnly
          />

          <AccountField name="accountId" label={t('Linked account')} />

          <DateField
            name="syncFrom"
            label={t('Sync transactions from')}
            dateFormat="date.format.fullDateWithDayOfWeek"
          />
        </FormBody>

        <footer className={styles.footer}>
          <Button variant="secondaryGray" onClick={handleSyncNowClick} loading={isSyncing}>
            {t('Sync Now')}
          </Button>
          <SaveButton type="submit" variant="primary" isIgnoreValidation disabled={isSyncing}>
            {t('Save')}
          </SaveButton>
        </footer>
      </Form>
    );
  }
);

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {}

function UnlinkButton({ onClick }: ButtonProps): JSX.Element {
  return (
    <button type="button" className={styles.unlinkButton} onClick={onClick}>
      <LingBroken01Icon />
    </button>
  );
}
