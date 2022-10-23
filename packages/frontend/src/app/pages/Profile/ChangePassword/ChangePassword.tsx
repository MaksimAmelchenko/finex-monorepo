import React, { useCallback, useMemo } from 'react';
import * as Yup from 'yup';
import { FormikHelpers } from 'formik';
import { observer } from 'mobx-react-lite';
import { useSnackbar } from 'notistack';

import { AuthRepository } from '../../../core/other-stores/auth-repository';
import { Form, FormButton, FormLayout, FormTextField } from '../../../components/Form';
import { getT } from '../../../lib/core/i18n';
import { useStore } from '../../../core/hooks/use-store';

import styles from '../Profile.module.scss';
import { Shape } from '../../../types';

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
        password: Yup.string().required(t('Please enter password')),
        newPassword: Yup.string().required(t('Please enter new password')),
      }),
    []
  );

  return (
    <div className={styles.section}>
      <div className={styles.section__sidebar}>
        <h2 className={styles.section__title}>{t('Password')}</h2>
      </div>

      <div className={styles.section__content}>
        <Form<IFormValues>
          onSubmit={onSubmit}
          initialValues={{ password: '', newPassword: '' }}
          validationSchema={validationSchema}
        >
          <FormLayout>
            <input name="username" value={username} readOnly autoComplete="off" className={styles.hidden} />
            <FormTextField
              name="password"
              type="password"
              label={t('Current password')}
              autoFocusOnEmpty={true}
              autoComplete="current-password"
              helperText={t('You must provide your current password in order to change it.')}
            />

            <FormTextField
              name="newPassword"
              type="password"
              label={t('New password')}
              autoFocusOnEmpty={true}
              autoComplete="new-password"
            />
          </FormLayout>
          <footer className={styles.form__footer}>
            <FormButton type="submit" size="small" color="primary" isIgnoreValidation>
              {t('Save password')}
            </FormButton>
          </footer>
        </Form>
      </div>
    </div>
  );
});
