import React from 'react';

import { getT, toNumber } from '../../lib/core/i18n';
import { ArrowForwardIcon, IconButton } from '@finex/ui-kit';

import styles from './Pagination.module.scss';

export interface PaginationProps {
  count: number;
  offset: number;
  total: number;
  onPreviousPage: () => void;
  onNextPage: () => void;
}

const t = getT('Pagination');

export function Pagination({ count, offset, total, onPreviousPage, onNextPage }: PaginationProps): JSX.Element | null {
  if (!total) {
    return null;
  }

  return (
    <div className={styles.pagination}>
      <span className={styles.pagination__label}>
        {toNumber(offset + 1)}–{toNumber(offset + count)} {t('of')} {toNumber(total)}
      </span>
      <div className={styles.pagination__buttons}>
        <IconButton onClick={onPreviousPage} disabled={offset === 0}>
          <ArrowForwardIcon className={styles.pagination__previousIcon} />
        </IconButton>
        <IconButton onClick={onNextPage} disabled={offset + count === total}>
          <ArrowForwardIcon />
        </IconButton>
      </div>
    </div>
  );
}
