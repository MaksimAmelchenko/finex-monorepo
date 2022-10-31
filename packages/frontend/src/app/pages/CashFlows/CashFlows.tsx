import React, { useCallback, useEffect, useMemo, useState } from 'react';
import clsx from 'clsx';
import { observer } from 'mobx-react-lite';
import { useSnackbar } from 'notistack';

import { Button, FilterIcon, IconButton, ISelectOption, MagnifyingGlassIcon } from '@finex/ui-kit';
import { ContractorsRepository } from '../../stores/contractors-repository';
import { CashFlow } from '../../stores/models/cash-flow';
import { CashFlowRow } from './CashFlowRow/CashFlowRow';
import { CashFlowWindow } from '../../containers/CashFlowWindow/CashFlowWindow';
import { CashFlowsRepository } from '../../stores/cash-flows-repository';
import { Form, FormTextField } from '../../components/Form';
import { HeaderLayout } from '../../components/HeaderLayout/HeaderLayout';
import { ICashFlow } from '../../types/cash-flow';
import { MultiSelect } from '../../components/MultiSelect/MultiSelect';
import { Pagination } from '../../components/Pagination/Pagination';
import { ProjectsRepository } from '../../stores/projects-repository';
import { RangeSelect } from '../../components/RangeSelect/RangeSelect';
import { TagsRepository } from '../../stores/tags-repository';
import { getT } from '../../lib/core/i18n';
import { useStore } from '../../core/hooks/use-store';

import styles from './CashFlows.module.scss';

interface ISearchFormValues {
  searchText: string;
}

const t = getT('CashFlows');

export const CashFlows = observer(() => {
  const contractorsRepository = useStore(ContractorsRepository);
  const cashFlowsRepository = useStore(CashFlowsRepository);
  const projectsRepository = useStore(ProjectsRepository);
  const tagsRepository = useStore(TagsRepository);

  const { enqueueSnackbar } = useSnackbar();

  const [isOpenedCashFlowWindow, setIsOpenedCashFlowWindow] = useState<boolean>(false);

  const [cashFlow, setCashFlow] = useState<Partial<ICashFlow> | null>(null);

  const handleOpenAddCashFlow = () => {
    setCashFlow({});
    setIsOpenedCashFlowWindow(true);
  };

  const handleClickOnCashFlow = (cashFlow: CashFlow) => {
    setCashFlow(cashFlow);
    setIsOpenedCashFlowWindow(true);
  };

  const handleCloseCashFlowWindow = () => {
    setIsOpenedCashFlowWindow(false);
  };

  const { filter } = cashFlowsRepository;

  const { cashFlows, loadState, offset, total } = cashFlowsRepository;

  const selectContractorsOptions = useMemo<ISelectOption[]>(
    () => contractorsRepository.contractors.map(({ id: value, name: label }) => ({ value, label })),
    [contractorsRepository.contractors]
  );

  const selectTagsOptions = useMemo<ISelectOption[]>(() => {
    return tagsRepository.tags.map(({ id: value, name: label }) => ({ value, label }));
  }, [tagsRepository.tags]);

  useEffect(() => {
    cashFlowsRepository.fetch().catch(err => {
      let message = '';
      switch (err.code) {
        default:
          message = err.message;
      }

      enqueueSnackbar(message, { variant: 'error' });
    });
  }, [cashFlowsRepository, projectsRepository.currentProject]);

  const setRange = useCallback(
    (values: [Date | null, Date | null]) => {
      cashFlowsRepository.setFilter({ range: values });
    },
    [cashFlowsRepository]
  );

  const setContractors = (contractors: ISelectOption[]) => {
    cashFlowsRepository.setFilter({ contractors: contractors.map(({ value }) => value) });
  };

  const setTags = (tags: ISelectOption[]) => {
    cashFlowsRepository.setFilter({ tags: tags.map(({ value }) => value) });
  };

  const handlePreviousPageClick = () => {
    cashFlowsRepository.fetchPreviousPage();
  };

  const handleNextPageClick = () => {
    cashFlowsRepository.fetchNextPage();
  };

  const handleRefreshClick = () => {
    cashFlowsRepository.refresh();
  };

  const selectedCashFlows = cashFlows.filter(({ isSelected }) => isSelected);

  const handleDeleteClick = () => {
    if (selectedCashFlows.length > 1) {
      if (!window.confirm(t('Are you sure you want to delete several cash flows?'))) {
        return;
      }
    }

    selectedCashFlows.forEach(cashFlow => {
      cashFlowsRepository.removeCashFlow(cashFlow).catch(err => console.error({ err }));
    });
  };

  const handleSearchSubmit = ({ searchText }: ISearchFormValues): Promise<unknown> => {
    cashFlowsRepository.setFilter({ searchText });
    return cashFlowsRepository.refresh();
  };

  const handleToggleFilter = () => {
    cashFlowsRepository.setFilter({ isFilter: !filter.isFilter });
  };

  if (isOpenedCashFlowWindow && cashFlow) {
    return <CashFlowWindow isOpened={isOpenedCashFlowWindow} cashFlow={cashFlow} onClose={handleCloseCashFlowWindow} />;
  }

  return (
    <div className={styles.layout}>
      <HeaderLayout title={t('CashFlows')} />
      <main className={styles.content}>
        <div className={clsx(styles.content__panel, styles.panel)}>
          <div className={clsx(styles.panel__toolbar, styles.toolbar)}>
            <div className={styles.toolbar__buttons}>
              <Button variant="contained" size="small" color="primary" onClick={handleOpenAddCashFlow}>
                {t('New')}
              </Button>
              <Button variant="outlined" size="small" disabled={!selectedCashFlows.length} onClick={handleDeleteClick}>
                {t('Delete')}
              </Button>
              <Button variant="outlined" size="small" onClick={handleRefreshClick}>
                {t('Refresh')}
              </Button>
            </div>

            <div className={styles.toolbar__rightColumn}>
              <IconButton
                onClick={handleToggleFilter}
                size="small"
                className={clsx(filter.isFilter && styles.filterButton_active)}
              >
                <FilterIcon />
              </IconButton>
              <Form<ISearchFormValues> onSubmit={handleSearchSubmit} initialValues={{ searchText: filter.searchText }}>
                <FormTextField
                  name="searchText"
                  size="small"
                  placeholder={t('Enter search request')}
                  className={styles.toolbar__search}
                  startAdornment={MagnifyingGlassIcon}
                />
              </Form>
            </div>
          </div>

          <div className={styles.panel__pagination}>
            <Pagination
              count={cashFlows.length}
              offset={offset}
              total={total}
              onPreviousPage={handlePreviousPageClick}
              onNextPage={handleNextPageClick}
            />
          </div>

          {filter.isFilter && (
            <div className={clsx(styles.panel__filter, styles.filter)}>
              <RangeSelect values={filter.range} onChange={setRange} />

              <MultiSelect
                label={t('Counterparties')}
                options={selectContractorsOptions}
                values={selectContractorsOptions.filter(({ value }) => filter.contractors.includes(value))}
                onChange={setContractors}
                className={styles.multiSelect}
              />

              <MultiSelect
                label={t('Tags')}
                options={selectTagsOptions}
                values={selectTagsOptions.filter(({ value }) => filter.tags.includes(value))}
                onChange={setTags}
                className={styles.multiSelect}
              />
            </div>
          )}
        </div>
        <div className={styles.tableWrapper}>
          <table className={clsx('table table-hover table-sm', styles.table)}>
            <thead>
              <tr>
                <th style={{ paddingLeft: '0.8rem' }}>{t('Date')}</th>
                <th>
                  {t('Accounts')}
                  <br />
                  {t('Counterparty')}
                </th>
                <th>{t('Categories')}</th>
                <th colSpan={2}>{t('Income')}</th>
                <th colSpan={2}>{t('Expense')}</th>
                <th colSpan={2}>{t('Balance')}</th>
                <th className="hidden-sm">{t('Note')}</th>
                <th className="hidden-sm">{t('Tags')}</th>
              </tr>
            </thead>
            <tbody>
              {cashFlows.map(cashFlow => (
                <CashFlowRow cashFlow={cashFlow} onClick={handleClickOnCashFlow} key={cashFlow.id} />
              ))}
            </tbody>
            <tfoot></tfoot>
          </table>
        </div>
      </main>
    </div>
  );
});
