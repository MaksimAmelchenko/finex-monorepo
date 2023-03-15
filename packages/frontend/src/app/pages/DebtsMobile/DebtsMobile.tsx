import React, { Fragment, useEffect, useState } from 'react';
import PullToRefresh from 'pulltorefreshjs';
import { observer } from 'mobx-react-lite';

import { AppBar } from '../../components/AppBar/AppBar';
import { Button } from '@finex/ui-kit';
import { Debt } from '../../stores/models/debt';
import { DebtCard } from '../../components/DebtCard/DebtCard';
import { DebtsRepository } from '../../stores/debts-repository';
import { LoadState } from '../../core/load-state';
import { Loader } from '../../components/Loader/Loader';
import { formatDate, getT } from '../../lib/core/i18n';
import { useStore } from '../../core/hooks/use-store';

import styles from './DebtsMobile.module.scss';

const t = getT('DebtsMobile');

export const DebtsMobile = observer(() => {
  const debtsRepository = useStore(DebtsRepository);

  const [debt, setDebt] = useState<Debt | null>(null);

  useEffect(() => {
    debtsRepository.refresh();
  }, []);

  const handleCardClick = (debtId: string) => {
    const debt = debtsRepository.getDebt(debtId);
    if (debt) {
      setDebt(debt);
    }
  };

  const handleClose = () => {
    setDebt(null);
  };

  useEffect(() => {
    PullToRefresh.init({
      mainElement: `.${styles.layout}`,
      triggerElement: `.${styles.layout}`,
      instructionsReleaseToRefresh: ' ',
      instructionsRefreshing: ' ',
      instructionsPullToRefresh: ' ',
      onRefresh() {
        debtsRepository.refresh();
      },
      shouldPullToRefresh() {
        // @ts-ignore
        return !this.mainElement.scrollTop;
      },
      refreshTimeout: 0,
    });

    return () => {
      PullToRefresh.destroyAll();
    };
  }, []);

  if (!debtsRepository.debts.length && debtsRepository.loadState.isPending()) {
    return (
      <div className={styles.layout}>
        <Loader />
      </div>
    );
  }

  return (
    <>
      <AppBar title={t('Debts')} />
      <div className={styles.layout}>
        {debtsRepository.debtsByDates.map(debtsByDate => {
          return (
            <Fragment key={debtsByDate.date}>
              <div className={styles.section__header}>
                {formatDate(debtsByDate.date, 'date.formats.fullDateWithDayOfWeek')}
              </div>
              <div className={styles.section__content}>
                {debtsByDate.debts.map(debt => (
                  <DebtCard debt={debt} onClick={handleCardClick} key={debt.id} />
                ))}
              </div>
            </Fragment>
          );
        })}

        {debtsRepository.loadState !== LoadState.none() &&
          debtsRepository.debts.length > 0 &&
          debtsRepository.debts.length < debtsRepository.total && (
            <div className={styles.loadMorePanel}>
              <Button
                fullSize
                onClick={() => debtsRepository.fetchMore()}
                loading={debtsRepository.loadState.isPending()}
              >
                {t('Load more')}
              </Button>
            </div>
          )}
      </div>
    </>
  );
});

export default DebtsMobile;
