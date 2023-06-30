import React, { useCallback, useEffect, useMemo, useState } from 'react';
import clsx from 'clsx';
import { observer } from 'mobx-react-lite';
import { useLocation } from 'react-router-dom';
import { useSnackbar } from 'notistack';

import {
  Button,
  DataFlow03Icon,
  FilterFunnel01Icon,
  ISelectOption,
  IconButton,
  PlusIcon,
  RefreshCW01Icon,
  SearchMdIcon,
} from '@finex/ui-kit';
import { CashFlow } from '../../stores/models/cash-flow';
import { CashFlowRow } from './CashFlowRow/CashFlowRow';
import { CashFlowWindow } from '../../containers/CashFlowWindow/CashFlowWindow';
import { CashFlowsRepository } from '../../stores/cash-flows-repository';
import { ContractorsRepository } from '../../stores/contractors-repository';
import { EmptyState } from '../../components/EmptyState/EmptyState';
import { Form, FormInput } from '../../components/Form';
import { HeaderLayout } from '../../components/HeaderLayout/HeaderLayout';
import { ICashFlow } from '../../types/cash-flow';
import { LoadState } from '../../core/load-state';
import { Loader } from '../../components/Loader/Loader';
import { MultiSelect } from '../../components/MultiSelect/MultiSelect';
import { Pagination } from '../../components/Pagination/Pagination';
import { ProjectsRepository } from '../../stores/projects-repository';
import { RangeSelect } from '../../components/RangeSelect/RangeSelect';
import { TagsRepository } from '../../stores/tags-repository';
import { TrashIcon } from '../../components/TrashIcon/TrashIcon';
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

  const [isOpenedCashFlowWindow, setIsOpenedCashFlowWindow] = useState<boolean>(false);

  const [cashFlow, setCashFlow] = useState<Partial<ICashFlow> | null>(null);

  const location = useLocation();
  const { enqueueSnackbar } = useSnackbar();

  const handleOpenAddCashFlow = () => {
    setCashFlow({});
    setIsOpenedCashFlowWindow(true);
  };

  const handleClearSearchAndFiltersClick = () => {
    cashFlowsRepository.setFilter({
      range: [null, null],
      isFilter: false,
      searchText: '',
      accounts: [],
      contractors: [],
      tags: [],
    });
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
    const searchParams = new URLSearchParams(location.search);
    const contractors = searchParams.get('contractors')?.split(',') || [];

    if (contractors.length) {
      cashFlowsRepository.setFilter({ isFilter: true, contractors });
    } else {
      cashFlowsRepository.fetch().catch(err => {
        let message = '';
        switch (err.code) {
          default:
            message = err.message;
        }

        enqueueSnackbar(message, { variant: 'error' });
      });
    }
  }, [location.search, cashFlowsRepository, enqueueSnackbar, projectsRepository.currentProject]);

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

  const isDeleteButtonDisabled = Boolean(!selectedCashFlows.length);
  const isNoData = loadState === LoadState.done() && !cashFlows.length && !(filter.isFilter || filter.searchText);
  const isNotFound = Boolean(
    loadState === LoadState.done() && !cashFlows.length && (filter.isFilter || filter.searchText)
  );

  return (
    <div className={styles.layout}>
      <HeaderLayout title={t('CashFlows')} data-cy="cash-flows-header" />
      <main className={styles.content}>
        <div className={clsx(styles.content__panel, styles.panel)}>
          <div className={clsx(styles.panel__toolbar, styles.toolbar)}>
            <div className={styles.toolbar__buttons}>
              <Button
                size="md"
                startIcon={<PlusIcon />}
                onClick={handleOpenAddCashFlow}
                data-cy="cf-create-cash-flow-button"
              >
                {t('New')}
              </Button>
              <Button
                variant="secondaryGray"
                size="md"
                startIcon={<TrashIcon disabled={isDeleteButtonDisabled} />}
                disabled={isDeleteButtonDisabled}
                onClick={handleDeleteClick}
              >
                {t('Delete')}
              </Button>
              <Button variant="secondaryGray" size="md" startIcon={<RefreshCW01Icon />} onClick={handleRefreshClick}>
                {t('Refresh')}
              </Button>
            </div>

            <div className={styles.toolbar__rightColumn}>
              <IconButton
                onClick={handleToggleFilter}
                size="small"
                className={clsx(filter.isFilter && styles.filterButton_active)}
              >
                <FilterFunnel01Icon />
              </IconButton>
              <Form<ISearchFormValues>
                onSubmit={handleSearchSubmit}
                initialValues={{ searchText: filter.searchText }}
                enableReinitialize
                name="cash-flows-search"
              >
                <FormInput
                  name="searchText"
                  size="sm"
                  placeholder={t('Enter search request')}
                  className={styles.toolbar__search}
                  startIcon={<SearchMdIcon />}
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
          {loadState === LoadState.pending() ? (
            <Loader />
          ) : isNoData ? (
            <div className={styles.tableWrapper__emptyState}>
              <EmptyState
                illustration={<DataFlow03Icon className={styles.emptyState__illustration} />}
                text={t('Start by creating a Cash Flow')}
                supportingText={t(
                  'Cash Flow groups transactions. To create a Cash Flow, click on the "Create Cash Flow" button below'
                )}
              >
                <Button size="lg" startIcon={<PlusIcon />} onClick={handleOpenAddCashFlow}>
                  {t('Create Cash Flow')}
                </Button>
              </EmptyState>
            </div>
          ) : isNotFound ? (
            <div className={styles.tableWrapper__emptyState}>
              <EmptyState
                illustration={<SearchMdIcon className={styles.emptyState__illustration} />}
                text={t('No Cash Flows found')}
                supportingText={t(
                  'You search and/or filter criteria did not match any Cash Flows. Please try again with different criteria'
                )}
              >
                <Button variant="secondaryGray" size="lg" onClick={handleClearSearchAndFiltersClick}>
                  {t('Clear search')}
                </Button>
                <Button size="lg" startIcon={<PlusIcon />} onClick={handleOpenAddCashFlow}>
                  {t('Create Cash Flow')}
                </Button>
              </EmptyState>
            </div>
          ) : (
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
                  <th>{t('Income')}</th>
                  <th>{t('Expense')}</th>
                  <th>{t('Balance')}</th>
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
          )}
        </div>
      </main>
    </div>
  );
});
