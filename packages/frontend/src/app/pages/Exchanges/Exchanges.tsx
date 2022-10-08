import React, { useCallback, useEffect, useMemo, useState } from 'react';
import clsx from 'clsx';
import { observer } from 'mobx-react-lite';
import { useSnackbar } from 'notistack';

import { AccountsRepository } from '../../stores/accounts-repository';
import { Button, FilterIcon, IconButton, ISelectOption, SearchIcon } from '@finex/ui-kit';
import { Drawer } from '../../components/Drawer/Drawer';
import { Form, FormTextField } from '../../components/Form';
import { IExchange } from '../../types/exchange';
import { MultiSelect } from '../../components/MultiSelect/MultiSelect';
import { Pagination } from '../../components/Pagination/Pagination';
import { ProjectsRepository } from '../../stores/projects-repository';
import { RangeSelect } from '../../components/RangeSelect/RangeSelect';
import { TagsRepository } from '../../stores/tags-repository';
import { Exchange } from '../../stores/models/exchange';
import { ExchangeRow } from './ExchangeRow/ExchangeRow';
import { ExchangeWindow } from '../../containers/ExchangeWindow/ExchangeWindow';
import { ExchangesRepository } from '../../stores/exchanges-repository';
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
  }, [exchangesRepository, projectsRepository.currentProject]);

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

  const handleDeleteClick = () => {
    if (exchanges.filter(({ isSelected }) => isSelected).length > 1) {
      if (!window.confirm(t('Are you sure you what to delete several exchanges?'))) {
        return;
      }
    }

    exchanges
      .filter(({ isSelected }) => isSelected)
      .forEach(exchange => {
        exchangesRepository.removeExchange(exchange).catch(err => console.error({ err }));
      });
  };

  const handleSearchSubmit = ({ searchText }: ISearchFormValues): Promise<unknown> => {
    exchangesRepository.setFilter({ searchText });
    return exchangesRepository.refresh();
  };

  const handleBuyggleFilter = () => {
    exchangesRepository.setFilter({ isFilter: !filter.isFilter });
  };
  const selectedExchanges = exchanges.filter(({ isSelected }) => isSelected);

  return (
    <>
      <article>
        <div className={styles.panel}>
          <div className={clsx(styles.panel__toolbar, styles.toolbar)}>
            <div className={styles.toolbar__buttons}>
              <Button variant="contained" size="small" color="secondary" onClick={handleOpenAddExchange}>
                {t('New')}
              </Button>
              <Button variant="outlined" size="small" disabled={!selectedExchanges.length} onClick={handleDeleteClick}>
                {t('Delete')}
              </Button>
              <Button variant="outlined" size="small" onClick={handleRefreshClick}>
                {t('Refresh')}
              </Button>
            </div>

            <div className={styles.toolbar__rightColumn}>
              <IconButton
                onClick={handleBuyggleFilter}
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
              count={exchanges.length}
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
                label={t('Sell accounts')}
                options={selectAccountOptions}
                values={selectAccountOptions.filter(({ value }) => filter.accountsSell.includes(value))}
                onChange={setAccountsSell}
              />

              <MultiSelect
                label={t('Buy accounts')}
                options={selectAccountOptions}
                values={selectAccountOptions.filter(({ value }) => filter.accountsBuy.includes(value))}
                onChange={setAccountsBuy}
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
              <th>{t('Sell account')}</th>
              <th>{t('Buy account')}</th>
              <th colSpan={2}>{t('Sell')}</th>
              <th colSpan={2}>{t('Buy')}</th>
              <th>{t('Rate')}</th>
              <th colSpan={2}>{t('Fee')}</th>
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
      </article>

      <Drawer isOpened={isOpenedExchangeWindow}>
        {exchange && <ExchangeWindow exchange={exchange} onClose={handleCloseExchangeWindow} />}
      </Drawer>
    </>
  );
});