import React, { useCallback, useMemo, useState } from 'react';
import * as Yup from 'yup';

import { ApiErrors } from '../../core/errors';
import { AuthRepository } from '../../core/other-stores/auth-repository';
import { Form, FormButton, FormError, FormLayout, FormTextField } from '../../components/Form';
import { Layout } from '../../containers/Layout/Layout';
import { Link } from '../../components/Link/Link';
import { SignUpAcknowledgment } from './SignUpAcknowledgment/SignUpAcknowledgment';
import { getT } from '../../lib/core/i18n';
import { useStore } from '../../core/hooks/use-store';

import styles from './SignUp.module.scss';

interface ISignUpFormValues {
  name: string;
  username: string;
  password: string;
}

const t = getT('SignUp');

export function SignUp(): JSX.Element {
  const authStore = useStore(AuthRepository);
  const [email, setEmail] = useState<string>('');
  const [isDone, setIsDone] = useState<boolean>(false);

  const onSubmit = useCallback(
    (values: ISignUpFormValues) => {
      return authStore.signUp(values).then(() => {
        setEmail(values.username);
        setIsDone(true);
      });
    },
    [authStore]
  );

  const validationSchema = useMemo(
    () =>
      Yup.object().shape({
        name: Yup.string().required(t('Укажите ваше имя')),
        username: Yup.string().required(t('Укажите email')).email(t('Проверьте, правильно ли введён email')),
        password: Yup.string().required(t('Укажите пароль')).min(6, t('Введите не менее 8 символов')),
      }),
    []
  );

  if (isDone) {
    return <SignUpAcknowledgment email={email} />;
  }

  return (
    <Layout title={t('Регистрация')}>
      <div className={styles.container}>
        <Form<ISignUpFormValues>
          onSubmit={onSubmit}
          initialValues={{ name: '', username: '', password: '' }}
          validationSchema={validationSchema}
          errorsHR={[
            //
            [
              ApiErrors.Unauthorized,
              t('Неверный логин или пароль. Для быстрого восстановления пароля нажмите на ссылку «Забыли пароль?»'),
            ],
            [ApiErrors.ConflictError, t('Пользователь с таким email уже зарегистрирован')],
          ]}
        >
          <FormLayout className={styles.formLayout}>
            <FormTextField name="name" type="text" label={t('Имя')} autoFocusOnEmpty={true} />
            <FormTextField name="username" type="text" label={t('Email')} autoFocusOnEmpty={true} />
            <FormTextField
              name="password"
              type="password"
              label={t('Пароль')}
              autoFocusOnEmpty={true}
              autoComplete="current-password"
              helperText={t('Используйте 8 и более символом')}
            />
            <FormError />
            <FormButton type="submit" color="blue" fullSize isIgnoreValidation={true}>
              {t('Зарегистрироваться')}
            </FormButton>
            <div>
              <span>{t('Уже зарегистрировались?')}</span>{' '}
              <Link href="/sign-in" className={styles.footer__link}>
                {t('Войти')}
              </Link>
            </div>
          </FormLayout>
        </Form>
      </div>
    </Layout>
  );
}

export default SignUp;
