import { FunctionComponent, h } from 'preact';

import style from './style.css';
import { FormError } from '../FormError';
// <FormError / >

export const FormFooter: FunctionComponent = ({ children }): JSX.Element => {
  return (
    <footer class={style.footer}>
      <FormError />
      <div class={style.buttons}> {children} </div>
    </footer>
  );
};
