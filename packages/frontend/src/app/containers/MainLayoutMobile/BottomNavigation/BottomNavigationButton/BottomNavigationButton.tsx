import React, { HTMLAttributes } from 'react';

import { LinkBase } from '../../../../components/LinkBase/LinkBase';

import { TUrl } from '../../../../types';

import styles from './BottomNavigationButton.module.scss';

interface BottomNavigationButtonProps {
  href?: TUrl;
  label?: string;
  icon: React.FC;
  onClick?: () => void;
}

export function BottomNavigationButton({ href, label, icon: Icon, onClick }: BottomNavigationButtonProps): JSX.Element {
  return (
    <Wrapper href={href} className={styles.root} onClick={onClick}>
      <div className={styles.root__icon}>
        <Icon />
      </div>
      {label && <div className={styles.root__label}>{label}</div>}
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
