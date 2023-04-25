import React from 'react';
import clsx from 'clsx';

import { ILinkBaseProps, LinkBase } from '../LinkBase/LinkBase';

import styles from './Link.module.scss';

export interface ILinkProps extends ILinkBaseProps {}

export const Link = React.forwardRef<HTMLAnchorElement, ILinkProps>(function Link(props, ref) {
  const { className, children, ...rest } = props;
  return (
    <LinkBase {...rest} ref={ref} className={clsx(styles.root, className)}>
      {children}
    </LinkBase>
  );
});
