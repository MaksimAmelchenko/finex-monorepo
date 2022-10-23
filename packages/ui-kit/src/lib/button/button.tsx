import React, { HTMLAttributes } from 'react';
import { Link } from 'react-router-dom';
import clsx from 'clsx';

// import { Link } from '../Link/Link';
import styles from './button.module.scss';

export interface IButtonProps extends Omit<HTMLAttributes<HTMLButtonElement | HTMLAnchorElement>, 'css'> {
  children?: React.ReactNode; //  The content of the component.
  className?: string; // Override or extend the styles applied to the component.
  color?: 'primary' | 'secondary' | 'danger';
  disabled?: boolean; // If true, the component is disabled.
  loading?: boolean; // If true, the component is disabled.
  fullSize?: boolean; // If true, the button will take up the full width of its container
  href?: string; // The URL to link to when the button is clicked. If defined, an a element will be used as the root node.
  size?: 'small' | 'medium' | 'large'; // The size of the component.
  variant?: 'contained' | 'outlined';
  type?: 'button' | 'submit';
}

export const Button = ({ children, ...rest }: IButtonProps) => {
  return <ButtonStyledInner {...rest}>{children}</ButtonStyledInner>;
};

const ButtonStyledInner = ({
  type = 'button',
  size = 'medium',
  variant = 'contained',
  color = 'primary',
  fullSize = false,
  loading = false,
  disabled = false,
  className,
  href,
  ...props
}: IButtonProps): JSX.Element => {
  const classNameStyles = clsx(styles.button, className, {
    [styles[`button_size_${size}`]]: size,
    [styles[`button_disabled`]]: loading || disabled,
    [styles[`button_variant_${variant}`]]: true,
    [styles[`button_color_${color}`]]: true,
    [styles['button_fullSize']]: fullSize,
  });

  return href ? (
    <Link className={classNameStyles} to={href} {...props} />
  ) : (
    <button className={classNameStyles} {...props} type={type} disabled={disabled || loading} />
  );
};
