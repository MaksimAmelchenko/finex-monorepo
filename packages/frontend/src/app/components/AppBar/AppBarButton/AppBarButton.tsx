import React, { HTMLAttributes } from 'react';
import clsx from 'clsx';

import { LinkBase } from '../../LinkBase/LinkBase';
import { TUrl } from '../../../types';

import styles from './AppBarButton.module.scss';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  href?: string;
  icon: React.ReactNode;
  className?: string;
}

export function AppBarButton({ href, icon: Icon, onClick, className }: ButtonProps): JSX.Element {
  return (
    <Wrapper href={href} className={clsx(styles.root, className)} onClick={onClick}>
      {Icon}
    </Wrapper>
  );
}

interface WrapperProps extends Omit<HTMLAttributes<HTMLButtonElement | HTMLAnchorElement>, 'css'> {
  href?: TUrl;
  className: string;
}

function Wrapper({ href, className, ...rest }: WrapperProps): JSX.Element {
  return href ? (
    <LinkBase href={href} className={className} {...rest} />
  ) : (
    <button className={className} type="button" {...rest} />
  );
}
