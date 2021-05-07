import { h, JSX } from 'preact';

import style from './style.css';

export interface ICheckboxProps extends Omit<JSX.HTMLAttributes<HTMLInputElement>, 'value'> {
  value?: boolean;
  label: string;
  error?: string;
}

export function Checkbox({ label, disabled, value = false, error }: ICheckboxProps): JSX.Element {
  // const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
  //   onChange && onChange(event.target.checked, event);
  // };

  return (
    <label>
      <input type="checkbox" disabled={disabled} checked={value} />
      {label}
      {error && <div class={style.error}>{error}</div>}
    </label>
  );
}
