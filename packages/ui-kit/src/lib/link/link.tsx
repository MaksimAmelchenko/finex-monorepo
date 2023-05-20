import React, { AnchorHTMLAttributes } from 'react';
import clsx from 'clsx';
import { Link as ReactRouterLink, useLocation, useResolvedPath } from 'react-router-dom';

export interface LinkProps extends Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'css'> {
  href: string;
  className?: string;
}

export const Link = React.forwardRef<HTMLAnchorElement, LinkProps>(function LinkBase(props, ref) {
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
    <ReactRouterLink to={href} {...rest} ref={ref} className={clsx(className, isActive && 'active')}>
      {children}
    </ReactRouterLink>
  );
});
