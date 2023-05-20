import React, { Fragment, useEffect, useState } from 'react';
import PullToRefresh from 'pulltorefreshjs';
import { observer } from 'mobx-react-lite';

import { AppBar } from '../../components/AppBar/AppBar';
import { Button, CoinsHandIcon } from '@finex/ui-kit';
import { Debt } from '../../stores/models/debt';
import { DebtCard } from '../../components/DebtCard/DebtCard';
import { DebtWindowMobile } from '../../containers/DebtWindowMobile/DebtWindowMobile';
import { DebtsRepository } from '../../stores/debts-repository';
import { EmptyState } from '../../components/EmptyState/EmptyState';
import { LoadState } from '../../core/load-state';
import { Loader } from '../../components/Loader/Loader';
import { ProjectsRepository } from '../../stores/projects-repository';
import { SideSheetMobile } from '../../components/SideSheetMobile/SideSheetMobile';
import { formatDate, getT } from '../../lib/core/i18n';
import { useStore } from '../../core/hooks/use-store';

import { ReactComponent as HandDrawnArrowIllustration } from '../../illustrations/hand-drawn-arrow-14.svg';

import styles from './DebtsMobile.module.scss';

const t = getT('DebtsMobile');

export const DebtsMobile = observer(() => {
  const debtsRepository = useStore(DebtsRepository);
  const projectsRepository = useStore(ProjectsRepository);

  const [debt, setDebt] = useState<Debt | null>(null);

  useEffect(() => {
    debtsRepository.refresh();
  }, [debtsRepository, projectsRepository.currentProject]);

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
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        return !this.mainElement.scrollTop;
      },
      refreshTimeout: 0,
    });

    return () => {
      PullToRefresh.destroyAll();
    };
  }, [debtsRepository]);

  const { debts, loadState } = debtsRepository;

  function renderContent(): JSX.Element {
    if (!debts.length && loadState.isPending()) {
      return <Loader />;
    }

    if (!debts.length && loadState.isDone()) {
      return (
        <div className={styles.root__emptyState}>
          <EmptyState
            illustration={<CoinsHandIcon className={styles.root__emptyStateIllustration} />}
            text={t('Debts and Loans')}
            supportingText={t('To create a debt, click on the "plus" button below and select "Debt"')}
          />
          <div className={styles.root__pointer}>
            <HandDrawnArrowIllustration />
          </div>
        </div>
      );
    }

    return (
      <>
        {debtsRepository.debtsByDates.map(debtsByDate => {
          return (
            <Fragment key={debtsByDate.date}>
              <div className={styles.section__header}>
                {formatDate(debtsByDate.date, 'date.format.fullDateWithDayOfWeek')}
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
    );
  }

  return (
    <div className={styles.root}>
      <AppBar title={t('Debts')} />
      <main className={styles.root__main}>{renderContent()}</main>

      <SideSheetMobile open={Boolean(debt)}>
        {debt && <DebtWindowMobile debt={debt} onClose={handleClose} />}
      </SideSheetMobile>
    </div>
  );
});

export default DebtsMobile;
