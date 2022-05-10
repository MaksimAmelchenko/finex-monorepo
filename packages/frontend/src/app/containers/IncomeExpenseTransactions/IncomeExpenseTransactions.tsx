import React, { useCallback, useEffect, useMemo, useState } from 'react';
import clsx from 'clsx';
import { observer } from 'mobx-react-lite';

import { AccountsRepository } from '../../stores/accounts-repository';
import { AddCashFlowTransaction } from '../AddCashFlowTransaction/AddCashFlowTransaction';
import { Button, FilterIcon, IconButton, ISelectOption, SearchIcon } from '@finex/ui-kit';
import { CategoriesRepository } from '../../stores/categories-repository';
import { ContractorsRepository } from '../../stores/contractors-repository';
import { Form, FormTextField } from '../../components/Form';
import { IncomeExpenseTransaction } from './IncomeExpenseTransaction/IncomeExpenseTransaction';
import { IncomeExpenseTransactionsRepository } from '../../stores/income-expense-transactions-repository';
import { MultiSelect } from '../../components/MultiSelect/MultiSelect';
import { Pagination } from '../../components/Pagination/Pagination';
import { RangeSelect } from '../../components/RangeSelect/RangeSelect';
import { TagsRepository } from '../../stores/tags-repository';
import { getT } from '../../lib/core/i18n';
import { useStore } from '../../core/hooks/use-store';

import styles from './IncomeExpenseTransactions.module.scss';

interface ISearchFormValues {
  searchText: string;
}

const t = getT('IncomeExpenseTransactions');

export const IncomeExpenseTransactions = observer(() => {
  const accountsRepository = useStore(AccountsRepository);
  const categoriesRepository = useStore(CategoriesRepository);
  const contractorsRepository = useStore(ContractorsRepository);
  const incomeExpenseTransactionsRepository = useStore(IncomeExpenseTransactionsRepository);
  const tagsRepository = useStore(TagsRepository);

  const [isOpenedAddCashFlowTransaction, setIsOpenedAddCashFlowTransaction] = useState<boolean>(false);

  const handleOpenAddCashFlowTransaction = () => {
    setIsOpenedAddCashFlowTransaction(true);
  };
  const handleCloseAddCashFlowTransaction = () => {
    setIsOpenedAddCashFlowTransaction(false);
  };

  const { filter } = incomeExpenseTransactionsRepository;

  const { incomeExpenseTransactions, loadState, offset, total } = incomeExpenseTransactionsRepository;

  const selectAccountsOptions = useMemo<ISelectOption[]>(() => {
    return accountsRepository.accounts.map(({ id: value, name: label }) => ({ value, label }));
  }, [accountsRepository.accounts]);

  const selectCategoriesOptions = useMemo<ISelectOption[]>(
    () =>
      categoriesRepository.categories.map(({ id: value }) => {
        const label = categoriesRepository.path(value, true);
        return { value, label };
      }),
    [categoriesRepository]
  );

  const selectContractorsOptions = useMemo<ISelectOption[]>(
    () => contractorsRepository.contractors.map(({ id: value, name: label }) => ({ value, label })),
    [contractorsRepository.contractors]
  );

  const selectTagsOptions = useMemo<ISelectOption[]>(() => {
    return tagsRepository.tags.map(({ id: value, name: label }) => ({ value, label }));
  }, [tagsRepository.tags]);

  useEffect(() => {
    incomeExpenseTransactionsRepository.fetch().catch(console.error);
  }, []);

  const setRange = useCallback((values: [Date | null, Date | null]) => {
    incomeExpenseTransactionsRepository.setFilter({ range: values });
  }, []);

  const setAccounts = (accounts: ISelectOption[]) => {
    incomeExpenseTransactionsRepository.setFilter({ accounts: accounts.map(({ value }) => value) });
  };

  const setCategories = (categories: ISelectOption[]) => {
    incomeExpenseTransactionsRepository.setFilter({ categories: categories.map(({ value }) => value) });
  };

  const setContractors = (contractors: ISelectOption[]) => {
    incomeExpenseTransactionsRepository.setFilter({ contractors: contractors.map(({ value }) => value) });
  };

  const setTags = (tags: ISelectOption[]) => {
    incomeExpenseTransactionsRepository.setFilter({ tags: tags.map(({ value }) => value) });
  };

  const handlePreviousPageClick = () => {
    incomeExpenseTransactionsRepository.fetchPreviousPage();
  };

  const handleNextPageClick = () => {
    incomeExpenseTransactionsRepository.fetchNextPage();
  };

  const handleRefreshClick = () => {
    incomeExpenseTransactionsRepository.refresh();
  };

  const handleSearchSubmit = ({ searchText }: ISearchFormValues): Promise<unknown> => {
    filter.searchText = searchText;
    return incomeExpenseTransactionsRepository.refresh();
  };

  const handleToggleFilter = () => {
    incomeExpenseTransactionsRepository.setFilter({ isFilter: !filter.isFilter });
  };

  return (
    <>
      <article>
        {/*<div className={styles.search}>*/}
        {/*</div>*/}
        <div className={styles.panel}>
          <div className={clsx(styles.panel__toolbar, styles.toolbar)}>
            <div className={styles.toolbar__buttons}>
              <Button variant="contained" size="small" color="secondary" onClick={handleOpenAddCashFlowTransaction}>
                {t('New')}
              </Button>
              <Button variant="outlined" size="small" onClick={handleRefreshClick}>
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
              count={incomeExpenseTransactions.length}
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
                label={t('Accounts')}
                options={selectAccountsOptions}
                values={selectAccountsOptions.filter(({ value }) => filter.accounts.includes(value))}
                onChange={setAccounts}
              />

              <MultiSelect
                label={t('Categories')}
                options={selectCategoriesOptions}
                values={selectCategoriesOptions.filter(({ value }) => filter.categories.includes(value))}
                onChange={setCategories}
                // minimumInputLength={2}
              />

              <MultiSelect
                label={t('Counterparties')}
                options={selectContractorsOptions}
                values={selectContractorsOptions.filter(({ value }) => filter.contractors.includes(value))}
                onChange={setContractors}
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
              <th>
                {t('Account')}
                <br />
                {t('Counterparty')}
              </th>
              <th>{t('Category')}</th>
              <th className="hidden-sm hidden-md" colSpan={2}>
                {t('Income')}
              </th>
              <th className="hidden-sm hidden-md" colSpan={2}>
                {t('Expense')}
              </th>
              {/*<th className="hidden-lg" colSpan={2}>*/}
              {/*  {t('Amount')}*/}
              {/*</th>*/}
              <th className="hidden-sm">{t('Note')}</th>
              <th className="hidden-sm">{t('Tags')}</th>
            </tr>
          </thead>
          <tbody>
            {incomeExpenseTransactions.map((incomeExpenseTransaction, index) => (
              <IncomeExpenseTransaction
                incomeExpenseTransaction={incomeExpenseTransaction}
                key={incomeExpenseTransaction.id ?? index}
              />
            ))}
          </tbody>
          <tfoot></tfoot>
        </table>
      </article>

      <AddCashFlowTransaction isOpened={isOpenedAddCashFlowTransaction} onClose={handleCloseAddCashFlowTransaction} />
    </>
  );
});
