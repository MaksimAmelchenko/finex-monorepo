import React, { useCallback, useEffect, useMemo, useState } from 'react';
import clsx from 'clsx';
import { observer } from 'mobx-react-lite';

import { AccountsRepository } from '../../stores/accounts-repository';
import { Button, FilterIcon, IconButton, ISelectOption, SearchIcon } from '@finex/ui-kit';
import { TransactionWindow } from '../../containers/TransactionWindow/TransactionWindow';
import { CategoriesRepository } from '../../stores/categories-repository';
import { ContractorsRepository } from '../../stores/contractors-repository';
import { Drawer } from '../../components/Drawer/Drawer';
import { Form, FormTextField } from '../../components/Form';
import { ITransaction } from '../../types/transaction';
import { MultiSelect } from '../../components/MultiSelect/MultiSelect';
import { Pagination } from '../../components/Pagination/Pagination';
import { PlannedTransaction } from '../../stores/models/planned-transaction';
import { ProjectsRepository } from '../../stores/projects-repository';
import { RangeSelect } from '../../components/RangeSelect/RangeSelect';
import { TagsRepository } from '../../stores/tags-repository';
import { Transaction } from '../../stores/models/transaction';
import { TransactionRow } from './Transaction/Transaction';
import { TransactionsRepository } from '../../stores/transactions-repository';
import { getT } from '../../lib/core/i18n';
import { useStore } from '../../core/hooks/use-store';

import styles from './Transactions.module.scss';

interface ISearchFormValues {
  searchText: string;
}

const t = getT('Transactions');

export const Transactions = observer(() => {
  const accountsRepository = useStore(AccountsRepository);
  const categoriesRepository = useStore(CategoriesRepository);
  const contractorsRepository = useStore(ContractorsRepository);
  const transactionsRepository = useStore(TransactionsRepository);
  const projectsRepository = useStore(ProjectsRepository);
  const tagsRepository = useStore(TagsRepository);

  const [isOpenedTransactionWindow, setIsOpenedTransactionWindow] = useState<boolean>(false);

  const [transaction, setTransaction] = useState<Partial<ITransaction> | Transaction | PlannedTransaction>({});

  const handleOpenAddTransaction = () => {
    setTransaction({
      sign: -1,
      isNotConfirmed: false,
    });
    setIsOpenedTransactionWindow(true);
  };

  const handleClickOnTransaction = (transaction: Transaction | PlannedTransaction) => {
    setTransaction(transaction);
    setIsOpenedTransactionWindow(true);
  };

  const handleCloseTransactionWindow = () => {
    setIsOpenedTransactionWindow(false);
  };

  const { filter } = transactionsRepository;

  const { transactions, loadState, offset, total } = transactionsRepository;

  const selectAccountsOptions = useMemo<ISelectOption[]>(() => {
    return accountsRepository.accounts.map(({ id: value, name: label }) => ({ value, label }));
  }, [accountsRepository.accounts]);

  const selectCategoriesOptions = useMemo<ISelectOption[]>(
    () =>
      categoriesRepository.categories.map(category => {
        const label = category.fullPath(true);
        return { value: category.id, label };
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
    transactionsRepository.fetch().catch(console.error);
  }, [transactionsRepository, projectsRepository.currentProject]);

  const setRange = useCallback(
    (values: [Date | null, Date | null]) => {
      transactionsRepository.setFilter({ range: values });
    },
    [transactionsRepository]
  );

  const setAccounts = (accounts: ISelectOption[]) => {
    transactionsRepository.setFilter({ accounts: accounts.map(({ value }) => value) });
  };

  const setCategories = (categories: ISelectOption[]) => {
    transactionsRepository.setFilter({ categories: categories.map(({ value }) => value) });
  };

  const setContractors = (contractors: ISelectOption[]) => {
    transactionsRepository.setFilter({ contractors: contractors.map(({ value }) => value) });
  };

  const setTags = (tags: ISelectOption[]) => {
    transactionsRepository.setFilter({ tags: tags.map(({ value }) => value) });
  };

  const handlePreviousPageClick = () => {
    transactionsRepository.fetchPreviousPage();
  };

  const handleNextPageClick = () => {
    transactionsRepository.fetchNextPage();
  };

  const handleRefreshClick = () => {
    transactionsRepository.refresh();
  };

  const handleDeleteClick = () => {
    if (transactions.filter(({ isSelected }) => isSelected).length > 1) {
      if (!window.confirm(t('Are you sure you what to delete several transactions?'))) {
        return;
      }
    }

    transactions
      .filter(({ isSelected }) => isSelected)
      .forEach(transaction => {
        transactionsRepository.removeTransaction(transaction).catch(err => console.error({ err }));
      });
  };

  const handleSearchSubmit = ({ searchText }: ISearchFormValues): Promise<unknown> => {
    filter.searchText = searchText;
    return transactionsRepository.refresh();
  };

  const handleToggleFilter = () => {
    transactionsRepository.setFilter({ isFilter: !filter.isFilter });
  };

  const handleOnDateColumnHeaderClick = () => {
    transactions.forEach(transaction => transaction.toggleSelection());
  };

  return (
    <>
      <article>
        {/*<div className={styles.search}>*/}
        {/*</div>*/}
        <div className={styles.panel}>
          <div className={clsx(styles.panel__toolbar, styles.toolbar)}>
            <div className={styles.toolbar__buttons}>
              <Button variant="contained" size="small" color="secondary" onClick={handleOpenAddTransaction}>
                {t('New')}
              </Button>
              <Button variant="outlined" size="small" onClick={handleDeleteClick}>
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
              count={transactions.length}
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
              <th style={{ paddingLeft: '8px' }} onClick={handleOnDateColumnHeaderClick}>
                {t('Date')}
              </th>
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
            {transactions.map((transaction, index) => (
              <TransactionRow
                transaction={transaction}
                onClick={handleClickOnTransaction}
                key={
                  transaction instanceof Transaction
                    ? transaction.id
                    : `${transaction.planId}-${transaction.repetitionNumber}`
                }
              />
            ))}
          </tbody>
          <tfoot></tfoot>
        </table>
      </article>

      <Drawer isOpened={isOpenedTransactionWindow}>
        {transaction && (
          <TransactionWindow transaction={transaction} onClose={handleCloseTransactionWindow} />
        )}
      </Drawer>
    </>
  );
});