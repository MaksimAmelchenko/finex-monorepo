import React, { useCallback, useEffect, useMemo, useState } from 'react';
import clsx from 'clsx';
import { observer } from 'mobx-react-lite';
import { useSnackbar } from 'notistack';

import { AccountsRepository } from '../../stores/accounts-repository';
import { Button, FilterIcon, IconButton, ISelectOption, SearchIcon } from '@finex/ui-kit';
import { Drawer } from '../../components/Drawer/Drawer';
import { Form, FormTextField } from '../../components/Form';
import { ITransfer } from '../../types/transfer';
import { MultiSelect } from '../../components/MultiSelect/MultiSelect';
import { Pagination } from '../../components/Pagination/Pagination';
import { ProjectsRepository } from '../../stores/projects-repository';
import { RangeSelect } from '../../components/RangeSelect/RangeSelect';
import { TagsRepository } from '../../stores/tags-repository';
import { Transfer } from '../../stores/models/transfer';
import { TransferRow } from './TransferRow/TransferRow';
import { TransferWindow } from '../../containers/TransferWindow/TransferWindow';
import { TransfersRepository } from '../../stores/transfers-repository';
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
  }, [transfersRepository, projectsRepository.currentProject]);

  const setRange = useCallback(
    (values: [Date | null, Date | null]) => {
      transfersRepository.setFilter({ range: values });
    },
    [transfersRepository]
  );

  const setAccountsFrom = (accountsFrom: ISelectOption[]) => {
    transfersRepository.setFilter({ accountsFrom: accountsFrom.map(({ value }) => value) });
  };

  const setAccountsTo = (accountsTo: ISelectOption[]) => {
    transfersRepository.setFilter({ accountsTo: accountsTo.map(({ value }) => value) });
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

  const handleDeleteClick = () => {
    if (transfers.filter(({ isSelected }) => isSelected).length > 1) {
      if (!window.confirm(t('Are you sure you what to delete several transfers?'))) {
        return;
      }
    }

    transfers
      .filter(({ isSelected }) => isSelected)
      .forEach(transfer => {
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
  const selectedTransfers = transfers.filter(({ isSelected }) => isSelected);

  return (
    <>
      <article>
        <div className={styles.panel}>
          <div className={clsx(styles.panel__toolbar, styles.toolbar)}>
            <div className={styles.toolbar__buttons}>
              <Button variant="contained" size="small" color="secondary" onClick={handleOpenAddTransfer}>
                {t('New')}
              </Button>
              <Button variant="outlined" size="small" disabled={!selectedTransfers.length} onClick={handleDeleteClick}>
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
                  startAdornment={SearchIcon}
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
            <div className={styles.panel__filter}>
              <RangeSelect values={filter.range} onChange={setRange} />

              <MultiSelect
                label={t('From accounts')}
                options={selectAccountOptions}
                values={selectAccountOptions.filter(({ value }) => filter.accountsFrom.includes(value))}
                onChange={setAccountsFrom}
              />

              <MultiSelect
                label={t('To accounts')}
                options={selectAccountOptions}
                values={selectAccountOptions.filter(({ value }) => filter.accountsTo.includes(value))}
                onChange={setAccountsTo}
              />

              <MultiSelect
                label={t('Tags')}
                options={selectTagsOptions}
                values={selectTagsOptions.filter(({ value }) => filter.tags.includes(value))}
                onChange={setTags}
              />
            </div>
          )}
        </div>

        <table className={clsx('table table-hover table-sm', styles.table)}>
          <thead>
            <tr>
              <th style={{ paddingLeft: '8px' }}>{t('Date')}</th>
              <th>{t('From account')}</th>
              <th>{t('To account')}</th>
              <th colSpan={2}>{t('Amount')}</th>
              <th colSpan={2}>{t('Fee')}</th>
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
      </article>

      <Drawer isOpened={isOpenedTransferWindow}>
        {transfer && <TransferWindow transfer={transfer} onClose={handleCloseTransferWindow} />}
      </Drawer>
    </>
  );
});
