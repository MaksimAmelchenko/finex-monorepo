import React, { useCallback, useEffect, useMemo, useState } from 'react';
import clsx from 'clsx';
import { observer } from 'mobx-react-lite';
import { useSnackbar } from 'notistack';

import { AccountsRepository } from '../../stores/accounts-repository';
import { Button, FilterIcon, IconButton, ISelectOption, PlusIcon, SearchMdIcon } from '@finex/ui-kit';
import { Drawer } from '../../components/Drawer/Drawer';
import { Exchange } from '../../stores/models/exchange';
import { ExchangeRow } from './ExchangeRow/ExchangeRow';
import { ExchangeWindow } from '../../containers/ExchangeWindow/ExchangeWindow';
import { ExchangesRepository } from '../../stores/exchanges-repository';
import { Form, FormInput } from '../../components/Form';
import { HeaderLayout } from '../../components/HeaderLayout/HeaderLayout';
import { IExchange } from '../../types/exchange';
import { MultiSelect } from '../../components/MultiSelect/MultiSelect';
import { Pagination } from '../../components/Pagination/Pagination';
import { ProjectsRepository } from '../../stores/projects-repository';
import { RangeSelect } from '../../components/RangeSelect/RangeSelect';
import { TagsRepository } from '../../stores/tags-repository';
import { getT } from '../../lib/core/i18n';
import { useStore } from '../../core/hooks/use-store';

import styles from './Exchanges.module.scss';

interface ISearchFormValues {
  searchText: string;
}

const t = getT('Exchanges');

export const Exchanges = observer(() => {
  const accountsRepository = useStore(AccountsRepository);
  const exchangesRepository = useStore(ExchangesRepository);
  const projectsRepository = useStore(ProjectsRepository);
  const tagsRepository = useStore(TagsRepository);

  const { enqueueSnackbar } = useSnackbar();

  const [isOpenedExchangeWindow, setIsOpenedExchangeWindow] = useState<boolean>(false);

  const [exchange, setExchange] = useState<Partial<IExchange> | Exchange | null>(null);

  const handleOpenAddExchange = () => {
    setExchange({});
    setIsOpenedExchangeWindow(true);
  };

  const handleClickOnExchange = (exchange: Exchange) => {
    setExchange(exchange);
    setIsOpenedExchangeWindow(true);
  };

  const handleCloseExchangeWindow = () => {
    setIsOpenedExchangeWindow(false);
  };

  const { filter } = exchangesRepository;

  const { exchanges, loadState, offset, total } = exchangesRepository;

  const selectTagsOptions = useMemo<ISelectOption[]>(() => {
    return tagsRepository.tags.map(({ id: value, name: label }) => ({ value, label }));
  }, [tagsRepository.tags]);

  const selectAccountOptions = useMemo<ISelectOption[]>(
    () => accountsRepository.accounts.map(({ id: value, name: label }) => ({ value, label })),
    [accountsRepository.accounts]
  );

  useEffect(() => {
    exchangesRepository.fetch().catch(err => {
      let message = '';
      switch (err.code) {
        default:
          message = err.message;
      }

      enqueueSnackbar(message, { variant: 'error' });
    });
  }, [enqueueSnackbar, exchangesRepository, projectsRepository.currentProject]);

  const setRange = useCallback(
    (values: [Date | null, Date | null]) => {
      exchangesRepository.setFilter({ range: values });
    },
    [exchangesRepository]
  );

  const setAccountsSell = (accountsSell: ISelectOption[]) => {
    exchangesRepository.setFilter({ accountsSell: accountsSell.map(({ value }) => value) });
  };

  const setAccountsBuy = (accountsBuy: ISelectOption[]) => {
    exchangesRepository.setFilter({ accountsBuy: accountsBuy.map(({ value }) => value) });
  };

  const setTags = (tags: ISelectOption[]) => {
    exchangesRepository.setFilter({ tags: tags.map(({ value }) => value) });
  };

  const handlePreviousPageClick = () => {
    exchangesRepository.fetchPreviousPage();
  };

  const handleNextPageClick = () => {
    exchangesRepository.fetchNextPage();
  };

  const handleRefreshClick = () => {
    exchangesRepository.refresh();
  };

  const selectedExchanges = exchanges.filter(({ isSelected }) => isSelected);

  const handleDeleteClick = () => {
    if (selectedExchanges.length > 1) {
      if (!window.confirm(t('Are you sure you want to delete several exchanges?'))) {
        return;
      }
    }

    selectedExchanges.forEach(exchange => {
      exchangesRepository.removeExchange(exchange).catch(err => console.error({ err }));
    });
  };

  const handleSearchSubmit = ({ searchText }: ISearchFormValues): Promise<unknown> => {
    exchangesRepository.setFilter({ searchText });
    return exchangesRepository.refresh();
  };

  const handleToggleFilter = () => {
    exchangesRepository.setFilter({ isFilter: !filter.isFilter });
  };

  return (
    <div className={styles.layout}>
      <HeaderLayout title={t('Exchanges')} />
      <main className={styles.content}>
        <div className={clsx(styles.content__panel, styles.panel)}>
          <div className={clsx(styles.panel__toolbar, styles.toolbar)}>
            <div className={styles.toolbar__buttons}>
              <Button size="md" startIcon={<PlusIcon />} onClick={handleOpenAddExchange}>
                {t('New')}
              </Button>
              <Button
                variant="secondaryGray"
                size="md"
                disabled={!selectedExchanges.length}
                onClick={handleDeleteClick}
              >
                {t('Delete')}
              </Button>
              <Button variant="secondaryGray" size="md" onClick={handleRefreshClick}>
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
              <Form<ISearchFormValues>
                onSubmit={handleSearchSubmit}
                initialValues={{ searchText: filter.searchText }}
                name="exchanges-search"
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
              count={exchanges.length}
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
                label={t('Sell accounts')}
                options={selectAccountOptions}
                values={selectAccountOptions.filter(({ value }) => filter.accountsSell.includes(value))}
                onChange={setAccountsSell}
                className={styles.multiSelect}
              />

              <MultiSelect
                label={t('Buy accounts')}
                options={selectAccountOptions}
                values={selectAccountOptions.filter(({ value }) => filter.accountsBuy.includes(value))}
                onChange={setAccountsBuy}
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
                <th>{t('Sell account')}</th>
                <th>{t('Buy account')}</th>
                <th>{t('Sell')}</th>
                <th>{t('Buy')}</th>
                <th>{t('Rate')}</th>
                <th>{t('Fee')}</th>
                <th className="hidden-sm">{t('Note')}</th>
                <th className="hidden-sm">{t('Tags')}</th>
              </tr>
            </thead>
            <tbody>
              {exchanges.map(exchange => (
                <ExchangeRow exchange={exchange} onClick={handleClickOnExchange} key={exchange.id} />
              ))}
            </tbody>
            <tfoot></tfoot>
          </table>
        </div>
      </main>

      <Drawer open={isOpenedExchangeWindow}>
        {exchange && <ExchangeWindow exchange={exchange} onClose={handleCloseExchangeWindow} />}
      </Drawer>
    </div>
  );
});
