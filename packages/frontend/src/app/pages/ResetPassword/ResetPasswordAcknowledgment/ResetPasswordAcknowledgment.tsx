import { Layout } from '../../../containers/Layout/Layout';
import { getT } from '../../../lib/core/i18n';

import styles from './ResetPasswordAcknowledgment.module.scss';

const t = getT('ResetPasswordAcknowledgment');

export function ResetPasswordAcknowledgment(): JSX.Element {
  return (
    <Layout>
      <div className={styles.container}>
        <h1>{t('Reset password')} </h1>
        <p>
          {t(
            'An email has been sent to the specified email address. Please open it and click on the link inside it to reset your password'
          )}
        </p>
      </div>
    </Layout>
  );
}
