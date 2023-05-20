import React from 'react';
import clsx from 'clsx';

import { Link as LinkBase, LinkProps as LinkBaseProps } from '@finex/ui-kit';

import styles from './Link.module.scss';

export interface LinkProps extends LinkBaseProps {}

export const Link = React.forwardRef<HTMLAnchorElement, LinkProps>(function Link(props, ref) {
  const { className, children, ...rest } = props;
  return (
    <LinkBase {...rest} ref={ref} className={clsx(styles.root, className)}>
      {children}
    </LinkBase>
  );
});
