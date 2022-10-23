import React, { AnchorHTMLAttributes } from 'react';
import { Link } from 'react-router-dom';

import { GAOptions } from '../../types';

export interface ILinkBaseProps extends GAOptions, Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'css'> {
  href: string;
  className?: string;
}

export const LinkBase = React.forwardRef<HTMLAnchorElement, ILinkBaseProps>(function LinkBase(props, ref) {
  const { href, children, ...rest } = props;

  return /^(https?:\/\/|tel:|mailto:)/.test(href) ? (
    <a href={href} {...rest} target="_blank" rel="nofollow noopener noreferrer">
      {children}
    </a>
  ) : (
    <Link to={href} {...rest} ref={ref}>
      {children}
    </Link>
  );
});
