import { h } from 'preact';
import { observer } from 'mobx-react-lite';

import style from './style.css';
import clsx from 'clsx';

export const Home = observer(() => {
  return (
    <article class={clsx(style.home, 'scrollable')}>
      <h1>Home</h1>
    </article>
  );
});
