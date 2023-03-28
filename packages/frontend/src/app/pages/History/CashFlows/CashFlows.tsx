import React, { Fragment, useEffect, useState } from 'react';
import PullToRefresh from 'pulltorefreshjs';
import { observer } from 'mobx-react-lite';

import { Button, DataFlow03Icon } from '@finex/ui-kit';
import { CashFlowCard } from '../../../components/CashFlowCard/CashFlowCard';
import { CashFlowWindowMobile } from '../../../containers/CashFlowWindowMobile/CashFlowWindowMobile';
import { CashFlowsRepository } from '../../../stores/cash-flows-repository';
import { EmptyState } from '../../../components/EmptyState/EmptyState';
import { ICashFlow } from '../../../types/cash-flow';
import { LoadState } from '../../../core/load-state';
import { Loader } from '../../../components/Loader/Loader';
import { ProjectsRepository } from '../../../stores/projects-repository';
import { SideSheetMobile } from '../../../components/SideSheetMobile/SideSheetMobile';
import { formatDate, getT } from '../../../lib/core/i18n';
import { useStore } from '../../../core/hooks/use-store';

import { ReactComponent as HandDrawnArrowIllustration } from '../../../illustrations/hand-drawn-arrow-14.svg';

import styles from '../History.module.scss';

const t = getT('CashFlows');

export const CashFlows = observer(() => {
  const cashFlowsRepository = useStore(CashFlowsRepository);
  const projectsRepository = useStore(ProjectsRepository);

  const [cashFlow, setCashFlow] = useState<ICashFlow | null>(null);

  useEffect(() => {
    cashFlowsRepository.refresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [projectsRepository.currentProject]);

  const handleCardClick = (cashFlowItemId: string) => {
    const cashFlow = cashFlowsRepository.getCashFlow(cashFlowItemId);
    if (cashFlow) {
      setCashFlow(cashFlow);
    }
  };

  const handleClose = () => {
    setCashFlow(null);
  };

  useEffect(() => {
    PullToRefresh.init({
      mainElement: `.${styles.cashFlows}`,
      triggerElement: `.${styles.cashFlows}`,
      instructionsReleaseToRefresh: ' ',
      instructionsRefreshing: ' ',
      instructionsPullToRefresh: ' ',
      onRefresh() {
        cashFlowsRepository.refresh();
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
  }, [cashFlowsRepository]);

  const { cashFlowsByDates, loadState, cashFlows } = cashFlowsRepository;

  function renderContent(): JSX.Element {
    if (!cashFlowsByDates.length && loadState.isPending()) {
      return <Loader />;
    }

    if (!cashFlowsByDates.length && loadState.isDone()) {
      return (
        <div className={styles.root__emptyState}>
          <EmptyState
            illustration={<DataFlow03Icon className={styles.root__emptyStateIllustration} />}
            text={t('Cash Flows')}
            supportingText={t(
              'Cash Flow groups transactions. To create a Cash Flow, click on the "plus" button below and select "Cash Flow"'
            )}
          />
          <div className={styles.root__pointer}>
            <HandDrawnArrowIllustration />
          </div>
        </div>
      );
    }

    return (
      <>
        {cashFlowsByDates.map(cashFlowsByDate => {
          return (
            <Fragment key={cashFlowsByDate.date}>
              <div className={styles.section__header}>
                {formatDate(cashFlowsByDate.date, 'date.formats.fullDateWithDayOfWeek')}
              </div>
              <div className={styles.section__content}>
                {cashFlowsByDate.cashFlows.map(cashFlow => (
                  <CashFlowCard cashFlow={cashFlow} onClick={handleCardClick} key={cashFlow.id} />
                ))}
              </div>
            </Fragment>
          );
        })}

        {loadState !== LoadState.none() && cashFlows.length > 0 && cashFlows.length < cashFlowsRepository.total && (
          <div className={styles.loadMorePanel}>
            <Button fullSize onClick={() => cashFlowsRepository.fetchMore()} loading={loadState.isPending()}>
              {t('Load more')}
            </Button>
          </div>
        )}
      </>
    );
  }
  return (
    <div className={styles.cashFlows}>
      {renderContent()}

      <SideSheetMobile open={Boolean(cashFlow)}>
        {cashFlow && <CashFlowWindowMobile cashFlow={cashFlow} onClose={handleClose} />}
      </SideSheetMobile>
    </div>
  );
});
