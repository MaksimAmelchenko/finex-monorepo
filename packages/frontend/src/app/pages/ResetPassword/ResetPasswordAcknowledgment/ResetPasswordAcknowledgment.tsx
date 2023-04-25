import { Layout } from '../../../containers/Layout/Layout';
import { getT } from '../../../lib/core/i18n';

const t = getT('ResetPasswordAcknowledgment');

export function ResetPasswordAcknowledgment(): JSX.Element {
  return (
    <Layout title={t('Reset password')}>
      <p>
        {t(
          'An email has been sent to the specified e-mail address. Please open it and click on the link inside it to reset your password'
        )}
      </p>
    </Layout>
  );
}
