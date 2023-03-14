import React, { useCallback, useMemo } from 'react';
import * as Yup from 'yup';
import clsx from 'clsx';
import { FormikHelpers } from 'formik';
import { observer } from 'mobx-react-lite';
import { useSnackbar } from 'notistack';

import { AuthRepository } from '../../../core/other-stores/auth-repository';
import { Form, FormBody, FormButton, FormInput } from '../../../components/Form';
import { Shape } from '../../../types';
import { getT } from '../../../lib/core/i18n';
import { useStore } from '../../../core/hooks/use-store';

import styles from '../ProfileMobileContent.module.scss';

interface IFormValues {
  password: string;
  newPassword: string;
}

interface ChangePasswordProps {
  username?: string;
}

const t = getT('Profile');

export const ChangePassword = observer(({ username }: ChangePasswordProps) => {
  const authStore = useStore(AuthRepository);
  const { enqueueSnackbar } = useSnackbar();

  const onSubmit = useCallback(
    ({ password, newPassword }: IFormValues, formHelpers: FormikHelpers<IFormValues>) => {
      return authStore
        .changePassword(password, newPassword)
        .then(() => {
          enqueueSnackbar(t('Password has been change'), { variant: 'success' });
          formHelpers.setFieldValue('password', '', false);
          formHelpers.setFieldValue('newPassword', '', false);
        })
        .catch(err => {
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
    [authStore, enqueueSnackbar]
  );

  const validationSchema = useMemo(
    () =>
      Yup.object<Shape<IFormValues>>({
        password: Yup.string().required(t('You must provide your current password in order to change it')),
        newPassword: Yup.string().required(t('Please enter new password')),
      }),
    []
  );

  return (
    <div className={styles.section}>
      <div className={clsx(styles.section__header, styles.header)}>
        <h2 className={styles.header__title}>{t('Password')}</h2>
        <p className={styles.header__description}>{t('Please enter your current password to change your password.')}</p>
      </div>

      <Form<IFormValues>
        onSubmit={onSubmit}
        initialValues={{ password: '', newPassword: '' }}
        validationSchema={validationSchema}
        name="change-password-mobile"
      >
        <FormBody>
          <input name="username" value={username} readOnly autoComplete="off" className={styles.hidden} />
          <FormInput name="password" type="password" label={t('Current password')} autoComplete="current-password" />
          <FormInput name="newPassword" type="password" label={t('New password')} autoComplete="new-password" />
        </FormBody>

        <footer className={styles.section__footer}>
          <FormButton type="submit" size="sm" isIgnoreValidation>
            {t('Update password')}
          </FormButton>
        </footer>
      </Form>
    </div>
  );
});
