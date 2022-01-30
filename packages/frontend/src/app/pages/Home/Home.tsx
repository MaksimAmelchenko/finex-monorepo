import React from 'react';
import clsx from 'clsx';
import { observer } from 'mobx-react-lite';

import styles from './Home.module.scss';

export const Home = observer(() => {
  return (
    <article className={clsx(styles.home, 'scrollable')}>
      <h1>Home</h1>
    </article>
  );
});
