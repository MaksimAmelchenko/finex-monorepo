import { FunctionalComponent, h } from 'preact';
import { Link } from 'preact-router/match';
import style from './style.css';

export const Header: FunctionalComponent = () => {
  return (
    <header class={style.header}>
      <h1>Preact App</h1>
      <nav>
        <Link activeClassName={style.active} href="/">
          Home
        </Link>
        <Link activeClassName={style.active} href="/profile">
          Me
        </Link>
        <Link activeClassName={style.active} href="/404">
          John
        </Link>
      </nav>
    </header>
  );
};
