import { h } from 'preact';
import { lazy } from 'preact/compat';
import { observer } from 'mobx-react-lite';

const Accounts = lazy(() => import(/* webpackChunkName: "accounts" */ './index'));

export const AccountsLazy = () => <Accounts />;
