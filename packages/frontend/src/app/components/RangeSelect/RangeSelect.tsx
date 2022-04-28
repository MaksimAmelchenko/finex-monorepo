import { forwardRef, useEffect, useState } from 'react';
import { formatISO } from 'date-fns';

import { InlineDatePicker, Tag, TargetProps } from '@finex/ui-kit';
import { Target } from '../Target/Target';
import { formatDate, getT } from '../../lib/core/i18n';

import styles from './RangeSelect.module.scss';

const t = getT('RangeSelect');

const FromTarget = forwardRef<HTMLSpanElement, TargetProps>(({ onClick }, ref) => {
  return <Target label={t('From')} onClick={onClick} />;
});

const ToTarget = forwardRef<HTMLSpanElement, TargetProps>(({ onClick }, ref) => {
  return <Target label={t('To')} onClick={onClick} />;
});

interface RangeSelectProps {
  values: [Date | null, Date | null];
  onChange: (values: [Date | null, Date | null]) => void;
}

export function RangeSelect({ values, onChange }: RangeSelectProps) {
  const [startDate, setStartDate] = useState<Date | null>(values[0]);
  const [endDate, setEndDate] = useState<Date | null>(values[1]);

  useEffect(() => {
    onChange([startDate, endDate]);
  }, [onChange, startDate, endDate]);

  return (
    <div className={styles.container}>
      <div className={styles.container__dateControl}>
        <InlineDatePicker
          value={startDate}
          onChange={setStartDate}
          selectsStart
          startDate={startDate}
          endDate={endDate}
          target={FromTarget}
        />
        {startDate && <Tag onClose={() => setStartDate(null)}>{formatDate(formatISO(startDate))}</Tag>}
      </div>

      <div className={styles.container__dateControl}>
        <InlineDatePicker
          value={endDate}
          onChange={setEndDate}
          selectsEnd
          startDate={startDate}
          endDate={endDate}
          target={ToTarget}
          minDate={startDate}
        />
        {endDate && <Tag onClose={() => setEndDate(null)}>{formatDate(formatISO(endDate))}</Tag>}
      </div>
    </div>
  );
}
