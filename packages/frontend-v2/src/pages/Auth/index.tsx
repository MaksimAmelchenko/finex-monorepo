import { h, JSX } from 'preact';

import { SignInForm } from '../../containers/SignInForm';
import { getT } from '../../lib/core/i18n';

import style from './style.css';

const t = getT('Auth');

export const Auth = (): JSX.Element => {
  return (
    <div class={style.page}>
      <div class={style.container}>
        <SignInForm />
      </div>
    </div>
  );
};
