import { h } from 'preact';
import { observer } from 'mobx-react-lite';

import style from './style.css';

export const Home = observer(() => {
  return (
    <div class={style.home}>
      <h1>Home</h1>
    </div>
  );
});
