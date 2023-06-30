import React, { useCallback, useEffect, useMemo, useState } from 'react';
import clsx from 'clsx';
import { observer } from 'mobx-react-lite';
import { useSnackbar } from 'notistack';

import { AccountsRepository } from '../../stores/accounts-repository';
import {
  Button,
  FilterFunnel01Icon,
  ISelectOption,
  IconButton,
  PlusIcon,
  RefreshCW01Icon,
  RightLongIcon,
  SearchMdIcon,
  ReverseRightIcon,
} from '@finex/ui-kit';
import { Drawer } from '../../components/Drawer/Drawer';
import { EmptyState } from '../../components/EmptyState/EmptyState';
import { Form, FormInput } from '../../components/Form';
import { HeaderLayout } from '../../components/HeaderLayout/HeaderLayout';
import { ITransfer } from '../../types/transfer';
import { LoadState } from '../../core/load-state';
import { Loader } from '../../components/Loader/Loader';
import { MultiSelect } from '../../components/MultiSelect/MultiSelect';
import { Pagination } from '../../components/Pagination/Pagination';
import { ProjectsRepository } from '../../stores/projects-repository';
import { RangeSelect } from '../../components/RangeSelect/RangeSelect';
import { TagsRepository } from '../../stores/tags-repository';
import { Transfer } from '../../stores/models/transfer';
import { TransferRow } from './TransferRow/TransferRow';
import { TransferWindow } from '../../containers/TransferWindow/TransferWindow';
import { TransfersRepository } from '../../stores/transfers-repository';
import { TrashIcon } from '../../components/TrashIcon/TrashIcon';
import { getT } from '../../lib/core/i18n';
import { useStore } from '../../core/hooks/use-store';

import styles from './Transfers.module.scss';

interface ISearchFormValues {
  searchText: string;
}

const t = getT('Transfers');

export const Transfers = observer(() => {
  const accountsRepository = useStore(AccountsRepository);
  const transfersRepository = useStore(TransfersRepository);
  const projectsRepository = useStore(ProjectsRepository);
  const tagsRepository = useStore(TagsRepository);

  const { enqueueSnackbar } = useSnackbar();

  const [isOpenedTransferWindow, setIsOpenedTransferWindow] = useState<boolean>(false);

  const [transfer, setTransfer] = useState<Partial<ITransfer> | Transfer | null>(null);

  const handleOpenAddTransfer = () => {
    setTransfer({});
    setIsOpenedTransferWindow(true);
  };

  const handleClearSearchAndFiltersClick = () => {
    transfersRepository.setFilter({
      range: [null, null],
      isFilter: false,
      searchText: '',
      fromAccounts: [],
      toAccounts: [],
      tags: [],
    });
  };

  const handleClickOnTransfer = (transfer: Transfer) => {
    setTransfer(transfer);
    setIsOpenedTransferWindow(true);
  };

  const handleCloseTransferWindow = () => {
    setIsOpenedTransferWindow(false);
  };

  const { filter } = transfersRepository;

  const { transfers, loadState, offset, total } = transfersRepository;

  const selectTagsOptions = useMemo<ISelectOption[]>(() => {
    return tagsRepository.tags.map(({ id: value, name: label }) => ({ value, label }));
  }, [tagsRepository.tags]);

  const selectAccountOptions = useMemo<ISelectOption[]>(
    () => accountsRepository.accounts.map(({ id: value, name: label }) => ({ value, label })),
    [accountsRepository.accounts]
  );

  useEffect(() => {
    transfersRepository.fetch().catch(err => {
      let message = '';
      switch (err.code) {
        default:
          message = err.message;
      }

      enqueueSnackbar(message, { variant: 'error' });
    });
  }, [transfersRepository, projectsRepository.currentProject, enqueueSnackbar]);

  const setRange = useCallback(
    (values: [Date | null, Date | null]) => {
      transfersRepository.setFilter({ range: values });
    },
    [transfersRepository]
  );

  const setFromAccounts = (fromAccounts: ISelectOption[]) => {
    transfersRepository.setFilter({ fromAccounts: fromAccounts.map(({ value }) => value) });
  };

  const setToAccounts = (toAccounts: ISelectOption[]) => {
    transfersRepository.setFilter({ toAccounts: toAccounts.map(({ value }) => value) });
  };

  const setTags = (tags: ISelectOption[]) => {
    transfersRepository.setFilter({ tags: tags.map(({ value }) => value) });
  };

  const handlePreviousPageClick = () => {
    transfersRepository.fetchPreviousPage();
  };

  const handleNextPageClick = () => {
    transfersRepository.fetchNextPage();
  };

  const handleRefreshClick = () => {
    transfersRepository.refresh();
  };

  const selectedTransfers = transfers.filter(({ isSelected }) => isSelected);

  const handleDeleteClick = () => {
    if (selectedTransfers.length > 1) {
      if (!window.confirm(t('Are you sure you want to delete several transfers?'))) {
        return;
      }
    }

    selectedTransfers.forEach(transfer => {
      transfersRepository.removeTransfer(transfer).catch(err => console.error({ err }));
    });
  };

  const handleSearchSubmit = ({ searchText }: ISearchFormValues): Promise<unknown> => {
    transfersRepository.setFilter({ searchText });
    return transfersRepository.refresh();
  };

  const handleToggleFilter = () => {
    transfersRepository.setFilter({ isFilter: !filter.isFilter });
  };

  const isDeleteButtonDisabled = Boolean(!selectedTransfers.length);
  const isNoData = loadState === LoadState.done() && !transfers.length && !(filter.isFilter || filter.searchText);
  const isNotFound = Boolean(
    loadState === LoadState.done() && !transfers.length && (filter.isFilter || filter.searchText)
  );

  return (
    <div className={styles.layout}>
      <HeaderLayout title={t('Transfers')} />
      <main className={styles.content}>
        <div className={clsx(styles.content__panel, styles.panel)}>
          <div className={clsx(styles.panel__toolbar, styles.toolbar)}>
            <div className={styles.toolbar__buttons}>
              <Button size="md" startIcon={<PlusIcon />} onClick={handleOpenAddTransfer}>
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
                name="transfers-search"
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
              count={transfers.length}
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
                label={t('From accounts')}
                options={selectAccountOptions}
                values={selectAccountOptions.filter(({ value }) => filter.fromAccounts.includes(value))}
                onChange={setFromAccounts}
                className={styles.multiSelect}
              />

              <MultiSelect
                label={t('To accounts')}
                options={selectAccountOptions}
                values={selectAccountOptions.filter(({ value }) => filter.toAccounts.includes(value))}
                onChange={setToAccounts}
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
                illustration={<ReverseRightIcon className={styles.emptyState__illustration} />}
                text={t('Start by creating a Transfer')}
                supportingText={t(
                  'Transfer is moving money from one account to another. To create a Transfer, click on the "New Transfer" button below.'
                )}
              >
                <Button size="lg" startIcon={<PlusIcon />} onClick={handleOpenAddTransfer}>
                  {t('Create Transfer')}
                </Button>
              </EmptyState>
            </div>
          ) : isNotFound ? (
            <div className={styles.tableWrapper__emptyState}>
              <EmptyState
                illustration={<SearchMdIcon className={styles.emptyState__illustration} />}
                text={t('No Transfers found')}
                supportingText={t(
                  'You search and/or filter criteria did not match any Transfers. Please try again with different criteria'
                )}
              >
                <Button variant="secondaryGray" size="lg" onClick={handleClearSearchAndFiltersClick}>
                  {t('Clear search')}
                </Button>
                <Button size="lg" startIcon={<PlusIcon />} onClick={handleOpenAddTransfer}>
                  {t('Create Transfer')}
                </Button>
              </EmptyState>
            </div>
          ) : (
            <table className={clsx('table table-hover table-sm', styles.table)}>
              <thead>
                <tr>
                  <th style={{ paddingLeft: '0.8rem' }}>{t('Date')}</th>
                  <th>{t('From account')}</th>
                  <th>{t('To account')}</th>
                  <th>{t('Amount')}</th>
                  <th>{t('Fee')}</th>
                  <th className="hidden-sm">{t('Note')}</th>
                  <th className="hidden-sm">{t('Tags')}</th>
                </tr>
              </thead>
              <tbody>
                {transfers.map(transfer => (
                  <TransferRow transfer={transfer} onClick={handleClickOnTransfer} key={transfer.id} />
                ))}
              </tbody>
              <tfoot></tfoot>
            </table>
          )}
        </div>
      </main>

      <Drawer open={isOpenedTransferWindow}>
        {transfer && <TransferWindow transfer={transfer} onClose={handleCloseTransferWindow} />}
      </Drawer>
    </div>
  );
});
