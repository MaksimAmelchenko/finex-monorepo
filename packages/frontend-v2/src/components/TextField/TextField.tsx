import { h, JSX } from 'preact';
import clsx from 'clsx';

import style from './TextField.style.css';

export interface ITextFieldProps extends JSX.HTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  startAdornment?: JSX.Element;
  endAdornment?: JSX.Element;
}

export function TextField(props: ITextFieldProps): JSX.Element {
  const { error, label, name, id = name, type = 'text', placeholder, ...rest } = props;
  return (
    <div
      className={clsx(
        style['text-field'],
        style['text-field--dropdown'],
        error && style['text-field--error'],
        rest.value && style['text-field--filled']
      )}
    >
      <div className={clsx(style['text-field__container'])}>
        <input
          className={clsx(style['text-input'])}
          {...rest}
          id={id}
          type={type}
          placeholder={label ? '' : placeholder}
        />
        {label && (
          <label className={clsx(style['text-field-label'])} htmlFor={id}>
            {label}
          </label>
        )}
      </div>
      <div className={clsx(style['text-field-error'])}>{error}</div>
    </div>
  );
}
