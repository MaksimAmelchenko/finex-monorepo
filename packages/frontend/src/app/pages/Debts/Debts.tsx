import React, { useCallback, useEffect, useMemo, useState } from 'react';
import clsx from 'clsx';
import { observer } from 'mobx-react-lite';
import { useSnackbar } from 'notistack';

import {
  Button,
  CoinsHandIcon,
  FilterFunnel01Icon,
  ISelectOption,
  IconButton,
  PlusIcon,
  RefreshCW01Icon,
  SearchMdIcon,
} from '@finex/ui-kit';
import { ContractorsRepository } from '../../stores/contractors-repository';
import { Debt } from '../../stores/models/debt';
import { DebtRow } from './DebtRow/DebtRow';
import { DebtWindow } from '../../containers/DebtWindow/DebtWindow';
import { DebtsRepository } from '../../stores/debts-repository';
import { Form, FormInput } from '../../components/Form';
import { HeaderLayout } from '../../components/HeaderLayout/HeaderLayout';
import { IDebt } from '../../types/debt';
import { MultiSelect } from '../../components/MultiSelect/MultiSelect';
import { Pagination } from '../../components/Pagination/Pagination';
import { ProjectsRepository } from '../../stores/projects-repository';
import { RangeSelect } from '../../components/RangeSelect/RangeSelect';
import { TagsRepository } from '../../stores/tags-repository';
import { TrashIcon } from '../../components/TrashIcon/TrashIcon';
import { getT } from '../../lib/core/i18n';
import { useStore } from '../../core/hooks/use-store';

import styles from './Debts.module.scss';

interface ISearchFormValues {
  searchText: string;
}

const t = getT('Debts');

export const Debts = observer(() => {
  const contractorsRepository = useStore(ContractorsRepository);
  const debtsRepository = useStore(DebtsRepository);
  const projectsRepository = useStore(ProjectsRepository);
  const tagsRepository = useStore(TagsRepository);

  const { enqueueSnackbar } = useSnackbar();

  const [isOpenedDebtWindow, setIsOpenedDebtWindow] = useState<boolean>(false);

  const [debt, setDebt] = useState<Partial<IDebt> | null>(null);

  const handleOpenAddDebt = () => {
    setDebt({});
    setIsOpenedDebtWindow(true);
  };

  const handleClickOnDebt = (debt: Debt) => {
    setDebt(debt);
    setIsOpenedDebtWindow(true);
  };

  const handleCloseDebtWindow = () => {
    setIsOpenedDebtWindow(false);
  };

  const { filter } = debtsRepository;

  const { debts, loadState, offset, total } = debtsRepository;

  const selectContractorsOptions = useMemo<ISelectOption[]>(
    () => contractorsRepository.contractors.map(({ id: value, name: label }) => ({ value, label })),
    [contractorsRepository.contractors]
  );

  const selectTagsOptions = useMemo<ISelectOption[]>(() => {
    return tagsRepository.tags.map(({ id: value, name: label }) => ({ value, label }));
  }, [tagsRepository.tags]);

  const selectMoreOptions = useMemo<ISelectOption[]>(() => {
    return [
      {
        value: 'isOnlyNotPaid',
        label: t('Only debts with a non-zero balance'),
      },
    ];
  }, []);

  useEffect(() => {
    debtsRepository.fetch().catch(err => {
      let message = '';
      switch (err.code) {
        default:
          message = err.message;
      }

      enqueueSnackbar(message, { variant: 'error' });
    });
  }, [debtsRepository, enqueueSnackbar, projectsRepository.currentProject]);

  const setRange = useCallback(
    (values: [Date | null, Date | null]) => {
      debtsRepository.setFilter({ range: values });
    },
    [debtsRepository]
  );

  const setContractors = (contractors: ISelectOption[]) => {
    debtsRepository.setFilter({ contractors: contractors.map(({ value }) => value) });
  };

  const setTags = (tags: ISelectOption[]) => {
    debtsRepository.setFilter({ tags: tags.map(({ value }) => value) });
  };

  const setMore = (more: ISelectOption[]) => {
    debtsRepository.setFilter({ more: more.map(({ value }) => value as any) });
  };

  const handlePreviousPageClick = () => {
    debtsRepository.fetchPreviousPage();
  };

  const handleNextPageClick = () => {
    debtsRepository.fetchNextPage();
  };

  const handleRefreshClick = () => {
    debtsRepository.refresh();
  };

  const selectedDebts = debts.filter(({ isSelected }) => isSelected);

  const handleDeleteClick = () => {
    if (selectedDebts.length > 1) {
      if (!window.confirm(t('Are you sure you want to delete several debts?'))) {
        return;
      }
    }

    selectedDebts.forEach(debt => {
      debtsRepository.removeDebt(debt).catch(err => console.error({ err }));
    });
  };

  const handleSearchSubmit = ({ searchText }: ISearchFormValues): Promise<unknown> => {
    debtsRepository.setFilter({ searchText });
    return debtsRepository.refresh();
  };

  const handleToggleFilter = () => {
    debtsRepository.setFilter({ isFilter: !filter.isFilter });
  };

  if (isOpenedDebtWindow && debt) {
    return <DebtWindow isOpened={isOpenedDebtWindow} debt={debt} onClose={handleCloseDebtWindow} />;
  }

  const isDeleteButtonDisabled = Boolean(!selectedDebts.length);
  return (
    <div className={styles.layout}>
      <HeaderLayout title={t('Debts')} />
      <main className={styles.content}>
        <div className={clsx(styles.content__panel, styles.panel)}>
          <div className={clsx(styles.panel__toolbar, styles.toolbar)}>
            <div className={styles.toolbar__buttons}>
              <Button size="md" startIcon={<PlusIcon />} onClick={handleOpenAddDebt}>
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
                name="debts-search"
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
              count={debts.length}
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

              <MultiSelect
                label={t('More')}
                smallInputMessage=""
                options={selectMoreOptions}
                values={selectMoreOptions.filter(({ value }) => filter.more.includes(value as any))}
                onChange={setMore}
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
                <th>{t('Counterparty')}</th>
                <th>{t('Debt')}</th>
                <th>{t('Repayment')}</th>
                <th>{t('Debt balance')}</th>
                <th>{t('Interest')}</th>
                <th>{t('Fine')}</th>
                <th>{t('Fee')}</th>
                <th>{t('Cost (overpayment)')}</th>
                <th className="hidden-sm">{t('Note')}</th>
                <th className="hidden-sm">{t('Tags')}</th>
              </tr>
            </thead>
            <tbody>
              {debts.map(debt => (
                <DebtRow debt={debt} onClick={handleClickOnDebt} key={debt.id} />
              ))}
            </tbody>
            <tfoot></tfoot>
          </table>
        </div>
      </main>
    </div>
  );
});
