import { h, JSX } from 'preact';

import style from './style.css';

export interface IButtonProps extends JSX.HTMLAttributes<HTMLButtonElement> {
  label?: string;
}

export function Button(props: IButtonProps): JSX.Element {
  const { label, name, type = 'button', ...rest } = props;

  return <button class={style.button} {...rest} type={type} />;
}
