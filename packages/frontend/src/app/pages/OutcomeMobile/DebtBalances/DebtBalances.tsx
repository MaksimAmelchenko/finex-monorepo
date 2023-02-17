import React, { useEffect, useState } from 'react';
import clsx from 'clsx';
import { observer } from 'mobx-react-lite';

import { Accordion } from '@finex/ui-kit';
import { BalanceCard } from '../BalanceCard/BalanceCard';
import { BalanceRepository } from '../../../stores/balance-repository';
import { ProjectsRepository } from '../../../stores/projects-repository';
import { getT } from '../../../lib/core/i18n';
import { useStore } from '../../../core/hooks/use-store';

import styles from './DebtBalances.module.scss';

const t = getT('DebtBalancesMobile');

export const DebtBalances = observer(() => {
  const balanceRepository = useStore(BalanceRepository);
  const projectsRepository = useStore(ProjectsRepository);

  const [openedAccordionIds, setOpenedAccordionIds] = useState<string[]>([]);

  const toggleAccordion = (id: string) => () => {
    if (openedAccordionIds.includes(id)) {
      setOpenedAccordionIds(openedAccordionIds.filter(openedAccordionId => openedAccordionId !== id));
    } else {
      setOpenedAccordionIds([...openedAccordionIds, id]);
    }
  };

  useEffect(() => {
    balanceRepository.fetchBalance({}).catch(console.error);
  }, [projectsRepository.currentProject]);

  if (!balanceRepository.balancesLoadState.isDone()) {
    return null;
  }
  const { debtTypeBalances } = balanceRepository;

  return (
    <section className={clsx(styles.root)}>
      <header className={clsx(styles.root__header, styles.header)}>
        <h2 className={styles.header__title}>{t('Debts')}</h2>
      </header>

      {debtTypeBalances.map(({ debtType, balances, contractorBalances }) => {
        const isAccordion = contractorBalances.length > 0;
        const isExpanded = openedAccordionIds.includes(debtType.id);
        return (
          <div className={styles.balancePanel} onClick={toggleAccordion(debtType.id)} key={debtType.id}>
            <BalanceCard title={debtType.name} isAccordion={isAccordion} isExpanded={isExpanded} balances={balances} />
            <Accordion isExpanded={isExpanded}>
              {contractorBalances.map(({ contractor, balances }) => {
                return <BalanceCard title={contractor.name} balances={balances} key={contractor.id} />;
              })}
            </Accordion>
          </div>
        );
      })}
    </section>
  );
});
