import React from 'react';
import { getT } from '../../lib/core/i18n';
import { SignInForm } from '../../containers/SignInForm/SignInForm';

import './style.css';

const t = getT('Auth');

export const Auth = (): JSX.Element => {
  return (
    <div className="page">
      <div className="container">
        <SignInForm />
      </div>
    </div>
  );
};
