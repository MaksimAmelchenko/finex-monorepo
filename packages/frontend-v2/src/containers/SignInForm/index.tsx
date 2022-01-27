import { h, JSX } from 'preact';
import { useCallback, useMemo } from 'preact/hooks';
import * as Yup from 'yup';
import { FormikHelpers } from 'formik';

import { getT } from '../../lib/core/i18n';
import { useStore } from '../../core/hooks/use-store';
import { AuthRepository } from '../../core/other-stores/auth-repository';
import { Form } from '../../components/Form';
import { FormButton } from '../../components/Form/FormButton';
import { FormFooter } from '../../components/Form/FormFooter';
import { FormTextField } from '../../components/Form/FormTextField/FormTextField';
import { FormLayout } from '../../components/Form/FormLayout';
import { ApiErrors } from '../../core/errors';
import { CommonStorageStore } from '../../core/other-stores/common-storage-store';

interface ISignInFormProps {
  afterSubmit?: () => unknown;
}

const t = getT('SignInForm');

interface IAuthValues {
  username: string;
  password: string;
}

export const SignInForm = ({ afterSubmit }: ISignInFormProps): JSX.Element => {
  const username = useStore(CommonStorageStore).get('username');
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
        username: Yup.string().required(t('Enter username / e-mail address')).email(t('Invalid e-amil address')),
        password: Yup.string().required(t('Enter a password')),
      }),
    []
  );

  return (
    <Form<IAuthValues>
      onSubmit={onSubmit}
      afterSubmit={afterSubmit}
      initialValues={{ username: username ?? '', password: '' }}
      validationSchema={validationSchema}
      errorsHR={[
        //
        [ApiErrors.Unauthorized, t('Invalid username or password')],
      ]}
    >
      <FormLayout>
        <FormTextField name="username" type="text" label={t('Username')} autoFocusOnEmpty={true} />
        <FormTextField
          name="password"
          type="password"
          label={t('Password')}
          autoFocusOnEmpty={true}
          autocomplete="current-password"
        />
        <FormFooter>
          <FormButton type="submit" isIgnoreValidation={true}>
            {t('Sign In')}
          </FormButton>
        </FormFooter>
      </FormLayout>
    </Form>
  );
};
