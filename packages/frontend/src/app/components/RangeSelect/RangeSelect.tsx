import React, { forwardRef } from 'react';
import { formatISO } from 'date-fns';

import { InlineDatePicker, Tag, Target, TargetProps } from '@finex/ui-kit';
import { formatDate, getT } from '../../lib/core/i18n';

import styles from './RangeSelect.module.scss';

const t = getT('RangeSelect');

const FromTarget = forwardRef<HTMLSpanElement, TargetProps>(({ onClick }, ref) => {
  return <Target label={t('From')} onClick={onClick} className={styles.target} />;
});

const ToTarget = forwardRef<HTMLSpanElement, TargetProps>(({ onClick }, ref) => {
  return <Target label={t('To')} onClick={onClick} className={styles.target} />;
});

interface RangeSelectProps<IsStrict extends boolean> {
  values: [Value<IsStrict>, Value<IsStrict>];
  onChange: (values: [Value<IsStrict>, Value<IsStrict>]) => void;
  isStrict?: boolean;
}

type Value<IsStrict extends boolean> = IsStrict extends true ? Date : Date | null;

export function RangeSelect<IsStrict extends boolean = false>({
  values,
  onChange,
  isStrict = false,
}: RangeSelectProps<IsStrict>) {
  const startDate: Value<IsStrict> = values[0];
  const endDate: Value<IsStrict> = values[1];

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const onStartDateReset = isStrict ? undefined : () => onChange([null, endDate]);

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const onEndDateReset = isStrict ? undefined : () => onChange([startDate, null]);

  return (
    <div className={styles.container}>
      <div className={styles.container__dateControl}>
        <InlineDatePicker
          value={startDate}
          onChange={startDate => onChange([startDate, endDate])}
          selectsStart
          startDate={startDate}
          endDate={endDate}
          target={FromTarget}
        />
        {startDate && (
          <Tag size="lg" outline={false} onClose={onStartDateReset}>
            {formatDate(formatISO(startDate))}
          </Tag>
        )}
      </div>

      <div className={styles.container__dateControl}>
        <InlineDatePicker
          value={endDate}
          onChange={endDate => onChange([startDate, endDate])}
          selectsEnd
          startDate={startDate}
          endDate={endDate}
          target={ToTarget}
          minDate={startDate}
        />
        {endDate && (
          <Tag size="lg" outline={false} onClose={onEndDateReset}>
            {formatDate(formatISO(endDate))}
          </Tag>
        )}
      </div>
    </div>
  );
}
