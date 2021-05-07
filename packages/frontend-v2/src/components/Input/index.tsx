import { h, JSX } from 'preact';

import style from './style.css';

export interface IInputProps extends JSX.HTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export function Input(props: IInputProps): JSX.Element {
  const { error, label, name, id = name, type = 'text', ...rest } = props;

  return (
    <div class={style.field}>
      {label && <label htmlFor={id}>{label}</label>}
      <input {...rest} type={type} id={id} />
      {error && <div>{error}</div>}
    </div>
  );
}
