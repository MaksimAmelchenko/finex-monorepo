import React, { useCallback, useMemo, useRef } from 'react';
import { observer } from 'mobx-react-lite';
import { useLocation, useNavigate } from 'react-router-dom';

import { AppBar } from '../../components/AppBar/AppBar';
import { AppBarButton } from '../../components/AppBar/AppBarButton/AppBarButton';
import { CashFlows } from './CashFlows/CashFlows';
import { IOption, SearchMdIcon, SegmentedControl } from '@finex/ui-kit';
import { Operations } from './Operations/Operations';
import { getT } from '../../lib/core/i18n';

import styles from './History.module.scss';

type Tab = 'operations' | 'cash-flows';

const t = getT('History');

export const History = observer(() => {
  const location = useLocation();
  const navigate = useNavigate();

  const containerRef = useRef<HTMLDivElement | null>(null);

  const tabOptions: IOption[] = useMemo(
    () => [
      { value: 'operations', label: t('Operations') },
      { value: 'cash-flows', label: t('Cash Flows') },
    ],
    []
  );

  const handleTabChange = useCallback(
    (option: IOption) => {
      navigate({ hash: option.value });
      containerRef.current &&
        containerRef.current.scroll({
          top: 0,
          left: 0,
        });
    },
    [navigate]
  );

  const tab: Tab = location.hash === '#cash-flows' ? 'cash-flows' : 'operations';

  return (
    <div className={styles.root}>
      <AppBar
        title={t('History')}
        endAdornment={
          <AppBarButton
            icon={<SearchMdIcon />}
            onClick={() => {
              alert('Search');
            }}
          />
        }
      />
      <main className={styles.main}>
        <div className={styles.main__tabs}>
          <SegmentedControl value={tab} options={tabOptions} onChange={handleTabChange} />
        </div>

        <div className={styles.main__content} ref={containerRef}>
          {/**/}
          {tab === 'operations' ? <Operations /> : <CashFlows />}
        </div>
      </main>
    </div>
  );
});

export default History;
