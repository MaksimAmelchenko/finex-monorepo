import React from 'react';
import clsx from 'clsx';

import { Link } from 'react-router-dom';

import styles from './button.module.scss';

export interface ButtonProps extends Omit<React.HTMLAttributes<HTMLButtonElement | HTMLAnchorElement>, 'css'> {
  children?: React.ReactNode; //  The content of the component.
  className?: string; // Override or extend the styles applied to the component.
  destructive?: boolean;
  disabled?: boolean; // If true, the component is disabled.
  loading?: boolean; // If true, the component is disabled.
  fullSize?: boolean; // If true, the button will take up the full width of its container
  href?: string; // The URL to link to when the button is clicked. If defined, an a element will be used as the root node.
  size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  startIcon?: React.ReactNode;
  endIcon?: React.ReactNode;
  variant?:
    | 'primary'
    | 'secondaryColor'
    | 'secondaryGray'
    | 'tertiaryColor'
    | 'tertiaryGray'
    | 'linkColor'
    | 'linkGray';
  type?: 'button' | 'submit';
}

export function Button({
  type = 'button',
  size = 'md',
  variant = 'primary',
  fullSize = false,
  loading = false,
  disabled = false,
  destructive = false,
  startIcon: StartIcon,
  endIcon: EndIcon,
  className,
  href,
  children,
  ...props
}: ButtonProps) {
  const isDisabled = loading || disabled;
  const classNameStyles = clsx(
    styles.root,
    [styles[`root_size_${size}`]],
    [styles[`root_variant_${variant}`]],
    destructive && styles.root_destructive,
    fullSize && styles.root_fullSize,
    className
  );

  return href ? (
    <Link className={classNameStyles} to={href} {...props}>
      {StartIcon}
      {children}
      {EndIcon}
    </Link>
  ) : (
    <button className={classNameStyles} {...props} type={type} disabled={isDisabled}>
      {StartIcon}
      {children}
      {EndIcon}
    </button>
  );
}
