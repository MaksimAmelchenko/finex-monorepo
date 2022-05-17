import React from 'react';
import clsx from 'clsx';

export type TImageLazyVariant = 'none' | 'native';

import styles from './image.module.scss';

export interface IImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  alt: string;
  lazy?: TImageLazyVariant;
  className?: string;
}

export function Image({ src, lazy = 'native', alt, className, ...rest }: IImageProps): JSX.Element {
  switch (lazy) {
    case 'native':
      return <img src={src} loading="lazy" alt={alt} {...rest} className={clsx(styles.image, className)} />;
    default:
      return <img src={src} alt={alt} {...rest} className={clsx(styles.image, className)} />;
  }
}
