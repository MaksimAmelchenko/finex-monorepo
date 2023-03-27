import React, { AnchorHTMLAttributes } from 'react';
import clsx from 'clsx';
import { Link, useLocation, useResolvedPath } from 'react-router-dom';

import { GAOptions } from '../../types';

export interface ILinkBaseProps extends GAOptions, Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'css'> {
  href: string;
  className?: string;
}

export const LinkBase = React.forwardRef<HTMLAnchorElement, ILinkBaseProps>(function LinkBase(props, ref) {
  const { href, children, className, ...rest } = props;

  const path = useResolvedPath(href);
  const location = useLocation();

  const toPathname = path.pathname.toLowerCase();
  const locationPathname = location.pathname.toLowerCase();

  const isActive =
    locationPathname === toPathname ||
    (locationPathname.startsWith(toPathname) && locationPathname.charAt(toPathname.length) === '/');

  return /^(https?:\/\/|tel:|mailto:)/.test(href) ? (
    <a href={href} className={className} {...rest} target="_blank" rel="nofollow noopener noreferrer">
      {children}
    </a>
  ) : (
    <Link to={href} {...rest} ref={ref} className={clsx(className, isActive && 'active')}>
      {children}
    </Link>
  );
});
