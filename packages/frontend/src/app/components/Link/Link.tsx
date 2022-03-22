import React, { AnchorHTMLAttributes } from 'react';
import clsx from 'clsx';
import { Link as RouterLink } from 'react-router-dom';

import { GAOptions } from '../../types';

import styles from './Link.module.scss';

export interface ILinkProps extends GAOptions, Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'href' | 'css'> {
  href: string;
}

export const Link = React.forwardRef<HTMLAnchorElement, ILinkProps>(function Link(props, ref) {
  const { href, className, ...rest } = props;

  return /^(https?:\/\/|tel:|mailto:)/.test(href) ? (
    <a
      href={href}
      {...rest}
      target="_blank"
      rel="nofollow noopener noreferrer"
      className={clsx(className, styles.link)}
    />
  ) : (
    <RouterLink to={href} {...rest} ref={ref} className={clsx(styles.link, className)} />
  );
});
