import React, { useCallback, useMemo } from 'react';
import * as Yup from 'yup';
import clsx from 'clsx';
import { observer } from 'mobx-react-lite';
import { useSnackbar } from 'notistack';

import { Form, FormButton, FormLayout, FormInput } from '../../../components/Form';
import { ProfileRepository } from '../../../stores/profile-repository';
import { Shape } from '../../../types';
import { getT } from '../../../lib/core/i18n';
import { useStore } from '../../../core/hooks/use-store';

import styles from '../Profile.module.scss';

interface IFormValues {
  password: string;
}

interface DeleteAccountProps {
  username?: string;
}

const t = getT('Profile');

export const DeleteAccount = observer(({ username }: DeleteAccountProps) => {
  const profileRepository = useStore(ProfileRepository);
  const { enqueueSnackbar } = useSnackbar();

  const onSubmit = useCallback(
    (params: IFormValues): Promise<unknown> => {
      if (!window.confirm(t('Are you sure you want to delete account?'))) {
        return Promise.resolve();
      }

      return profileRepository.removeProfile(params).catch(err => {
        let message = '';
        switch (err.code) {
          case 'unauthorized': {
            message = t('Invalid password');
            break;
          }
          default:
            message = err.message;
        }
        enqueueSnackbar(message, { variant: 'error' });

        throw err;
      });
    },
    [profileRepository, enqueueSnackbar]
  );

  const validationSchema = useMemo(
    () =>
      Yup.object<Shape<IFormValues>>({
        password: Yup.string().required(t('Please enter password')),
      }),
    []
  );

  return (
    <div className={styles.section}>
      <div className={styles.section__sidebar}>
        <h2 className={clsx(styles.section__title, styles.section__title_danger)}>{t('Delete account')}</h2>
      </div>

      <div className={styles.section__content}>
        <Form
          onSubmit={onSubmit}
          initialValues={{ password: '' }}
          validationSchema={validationSchema}
          name="delete-account"
        >
          <FormLayout>
            <p>{t('This action deletes the account and all data it contains. There is no going back.')}</p>
            <input name="username" value={username} readOnly autoComplete="off" className={styles.hidden} />
            <FormInput
              name="password"
              type="password"
              label={t('Current password')}
              autoComplete="current-password"
              helperText={t('You must provide your current password in order to delete account.')}
            />
          </FormLayout>
          <footer className={styles.form__footer}>
            <FormButton type="submit" size="md" destructive isIgnoreValidation>
              {t('Delete account')}
            </FormButton>
          </footer>
        </Form>
      </div>
    </div>
  );
});
