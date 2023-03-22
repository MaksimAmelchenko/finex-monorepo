import React, { Fragment, useEffect, useState } from 'react';
import PullToRefresh from 'pulltorefreshjs';
import { observer } from 'mobx-react-lite';

import { AppBar } from '../../components/AppBar/AppBar';
import { Button } from '@finex/ui-kit';
import { Debt } from '../../stores/models/debt';
import { DebtCard } from '../../components/DebtCard/DebtCard';
import { DebtWindowMobile } from '../../containers/DebtWindowMobile/DebtWindowMobile';
import { DebtsRepository } from '../../stores/debts-repository';
import { LoadState } from '../../core/load-state';
import { Loader } from '../../components/Loader/Loader';
import { SideSheetMobile } from '../../components/SideSheetMobile/SideSheetMobile';
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
      mainElement: `.${styles.root__main}`,
      triggerElement: `.${styles.root__main}`,
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

  const { debts, loadState } = debtsRepository;

  return (
    <div className={styles.root}>
      <AppBar title={t('Debts')} />
      <main className={styles.root__main}>
        {!debts.length && loadState.isPending() ? (
          <Loader />
        ) : (
          <>
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

            {loadState !== LoadState.none() && debts.length > 0 && debts.length < debtsRepository.total && (
              <div className={styles.loadMorePanel}>
                <Button fullSize onClick={() => debtsRepository.fetchMore()} loading={loadState.isPending()}>
                  {t('Load more')}
                </Button>
              </div>
            )}
          </>
        )}
      </main>

      <SideSheetMobile open={Boolean(debt)}>
        {debt && <DebtWindowMobile debt={debt} onClose={handleClose} />}
      </SideSheetMobile>
    </div>
  );
});

export default DebtsMobile;
