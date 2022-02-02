import './SignUpAcknowledgment.module.scss';
import { Layout } from '../../../containers/Layout/Layout';
import styles from './SignUpAcknowledgment.module.scss';
import { getT } from '../../../lib/core/i18n';

export interface SignUpAcknowledgmentProps {
  email: string;
}

const t = getT('SignUpAcknowledgment');

export function SignUpAcknowledgment({ email }: SignUpAcknowledgmentProps) {
  return (
    <Layout>
      <div className={styles.container}>
        <h1>{t('Пожалуйста, подтвердите свой электронный адрес')} </h1>
        <p>
          {t(
            'Спасибо за регистрацию. На адрес {{email}} было отправлено электронное письмо. Пожалуйста, откройте его и нажмите на ссылку внутри его для подтверждения электронного адреса.',
            { email }
          )}
        </p>
      </div>
    </Layout>
  );
}
