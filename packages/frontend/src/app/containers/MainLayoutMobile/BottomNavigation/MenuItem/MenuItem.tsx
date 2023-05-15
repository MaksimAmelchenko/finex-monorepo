import React from 'react';

import { Link as LinkBase } from '@finex/ui-kit';
import { TUrl } from '../../../../types';

import styles from './MenuItem.module.scss';

interface MenuItemProps {
  href?: TUrl;
  label?: string;
  icon: React.FC;
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
}

export function MenuItem({ href, label, icon: Icon, onClick, ...rest }: MenuItemProps): JSX.Element {
  return (
    <Wrapper href={href} className={styles.root} onClick={onClick} {...rest}>
      <div className={styles.root__icon}>
        <Icon />
      </div>
      <div className={styles.root__label}>{label}</div>
    </Wrapper>
  );
}

interface WrapperProps extends Omit<React.HTMLAttributes<HTMLButtonElement | HTMLAnchorElement>, 'css'> {
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
