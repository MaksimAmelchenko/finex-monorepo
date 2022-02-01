import React, { useCallback, useMemo } from 'react';
import * as Yup from 'yup';
import { FormikHelpers } from 'formik';

import { ApiErrors } from '../../core/errors';
import { AuthRepository } from '../../core/other-stores/auth-repository';
import { CommonStorageStore } from '../../core/other-stores/common-storage-store';
import { Form, FormButton, FormError, FormLayout, FormTextField } from '../../components/Form';
import { Link } from '../../components/Link/Link';
import { getT } from '../../lib/core/i18n';
import { useStore } from '../../core/hooks/use-store';

import styles from './SignInForm.module.scss';

interface ISignInFormProps {
  afterSubmit?: () => unknown;
}

const t = getT('SignInForm');

interface IAuthValues {
  username: string;
  password: string;
}

export const SignInForm = ({ afterSubmit }: ISignInFormProps): JSX.Element => {
  const username = useStore(CommonStorageStore).get('username') ?? '';
  const authStore = useStore(AuthRepository);

  const onSubmit = useCallback(
    (values: IAuthValues, formHelpers: FormikHelpers<IAuthValues>) => {
      return authStore.signIn(values).catch(error => {
        // On error from backend we clear-up password field without validation
        formHelpers.setFieldValue('password', '', false);
        throw error;
      });
    },
    [authStore]
  );

  const validationSchema = useMemo(
    () =>
      Yup.object().shape({
        username: Yup.string().required(t('Укажите email')).email(t('Проверьте, правильно ли введён email')),
        password: Yup.string().required(t('Укажите пароль')),
      }),
    []
  );

  return (
    <Form<IAuthValues>
      onSubmit={onSubmit}
      afterSubmit={afterSubmit}
      initialValues={{ username, password: '' }}
      validationSchema={validationSchema}
      errorsHR={[
        //
        [
          ApiErrors.Unauthorized,
          t('Неверный логин или пароль. Для быстрого восстановления пароля нажмите на ссылку «Забыли пароль?»'),
        ],
      ]}
    >
      <FormLayout className={styles.formLayout}>
        <FormTextField name="username" type="text" label={t('Email')} autoFocusOnEmpty={true} />
        <FormTextField
          name="password"
          type="password"
          label={t('Пароль')}
          autoFocusOnEmpty={true}
          autoComplete="current-password"
        />
        <FormError />
        <FormButton type="submit" color="blue" fullSize isIgnoreValidation={true}>
          {t('Войти')}
        </FormButton>
        <Link href="/" className={styles.footer__link}>
          {t('Забыли пароль?')}
        </Link>
      </FormLayout>
    </Form>
  );
};
