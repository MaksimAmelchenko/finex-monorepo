import React, { HTMLAttributes } from 'react';
import { Link } from 'react-router-dom';
import clsx from 'clsx';

// import { Link } from '../Link/Link';
import styles from './icon-button.module.scss';

export interface IconButtonProps extends Omit<HTMLAttributes<HTMLButtonElement | HTMLAnchorElement>, 'css'> {
  children: React.ReactNode; //  The content of the component.
  className?: string; // Override or extend the styles applied to the component.
  // color?: 'blue' | 'orange';
  disabled?: boolean; // If true, the component is disabled.
  loading?: boolean; // If true, the component is disabled.
  href?: string; // The URL to link to when the button is clicked. If defined, an a element will be used as the root node.
  size?: 'medium' | 'large'; // The size of the component.
  // variant?: 'contained';
  // type?: 'button' | 'submit';
}

export const IconButton = ({ children, ...rest }: IconButtonProps) => {
  return <ButtonStyledInner {...rest}>{children}</ButtonStyledInner>;
};

const ButtonStyledInner = ({
  // type = 'button',
  size = 'medium',
  // variant = 'contained',
  // color = 'orange',
  // fullSize = false,
  loading = false,
  disabled = false,
  className,
  href,
  ...props
}: IconButtonProps): JSX.Element => {
  const classNameStyles = clsx(styles.button, className, {
    [styles[`button_size_${size}`]]: size,
    [styles[`button_disabled`]]: loading || disabled,
    // [styles[`button_variant_${variant}`]]: true,
    // [styles[`button_color_${color}`]]: true,
    // [styles['button_fullSize']]: fullSize,
  });

  return href ? (
    <Link className={classNameStyles} to={href} {...props} />
  ) : (
    <button className={classNameStyles} {...props} type="button" disabled={disabled || loading} />
  );
};
