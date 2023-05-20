import { Layout } from '../../../containers/Layout/Layout';
import { getT } from '../../../lib/core/i18n';

import styles from './SignUpAcknowledgment.module.scss';

export interface SignUpAcknowledgmentProps {
  email: string;
}

const t = getT('SignUpAcknowledgment');

export function SignUpAcknowledgment({ email }: SignUpAcknowledgmentProps) {
  return (
    <Layout>
      <h1 className={styles.root__title}>{t('Please confirm your e-mail address')} </h1>
      <p>
        {t(
          'Thanks for signing up. To complete your signup process, please open the confirmation email we just sent you on {{email}}, and click on the link.',
          { email }
        )}
      </p>
    </Layout>
  );
}
