import { h, FunctionalComponent } from 'preact';

import style from './style.css';

export const DialogLayout: FunctionalComponent = ({ children }) => <div class={style.root}>{children}</div>;
