import React from 'react';

import { getT, toNumber } from '../../lib/core/i18n';
import { ChevronRightIcon, IconButton } from '@finex/ui-kit';

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
        {toNumber(offset + 1, { precision: 0 })}–{toNumber(offset + count, { precision: 0 })} {t('of')} {toNumber(total, { precision: 0 })}
      </span>
      <div className={styles.pagination__buttons}>
        <IconButton onClick={onPreviousPage} size="small" disabled={offset === 0}>
          <ChevronRightIcon className={styles.pagination__previousIcon} />
        </IconButton>
        <IconButton onClick={onNextPage} size="small" disabled={offset + count === total}>
          <ChevronRightIcon />
        </IconButton>
      </div>
    </div>
  );
}
