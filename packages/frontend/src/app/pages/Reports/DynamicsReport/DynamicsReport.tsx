import React, { useCallback, useEffect, useMemo, useState } from 'react';
import clsx from 'clsx';
import { ToggleButton, ToggleButtonGroup } from '@mui/material';
import { observer } from 'mobx-react-lite';
import { useSnackbar } from 'notistack';

import { AccountsRepository } from '../../../stores/accounts-repository';
import { BarChart07Icon, Button, IOption, ISelectOption, InlineSelect, Select, TableIcon } from '@finex/ui-kit';
import { CategoriesRepository } from '../../../stores/categories-repository';
import { ContractorsRepository } from '../../../stores/contractors-repository';
import { DynamicsGraph } from './DynamicsGraph/DynamicsGraph';
import { DynamicsTable } from './DynamicsTable/DynamicsTable';
import { HeaderLayout } from '../../../components/HeaderLayout/HeaderLayout';
import { MoneysRepository } from '../../../stores/moneys-repository';
import { MultiSelect } from '../../../components/MultiSelect/MultiSelect';
import { ProjectsRepository } from '../../../stores/projects-repository';
import { RangeSelect } from '../../../components/RangeSelect/RangeSelect';
import { ReportsRepository, UsingType } from '../../../stores/reports-store';
import { TagsRepository } from '../../../stores/tags-repository';
import { getT } from '../../../lib/core/i18n';
import { useStore } from '../../../core/hooks/use-store';

import styles from './DynamicsReport.module.scss';

import { default as loadingSvg } from '../../../icons/loading.svg';

const t = getT('DynamicsReport');

export const DynamicsReport = observer(() => {
  const accountsRepository = useStore(AccountsRepository);
  const categoriesRepository = useStore(CategoriesRepository);
  const contractorsRepository = useStore(ContractorsRepository);
  const moneysRepository = useStore(MoneysRepository);
  const projectsRepository = useStore(ProjectsRepository);
  const reportsRepository = useStore(ReportsRepository);
  const tagsRepository = useStore(TagsRepository);

  const { enqueueSnackbar } = useSnackbar();

  const selectValueTypeOptions = useMemo<ISelectOption[]>(() => {
    return [
      {
        value: '1',
        label: t('Income'),
      },
      {
        value: '2',
        label: t('Expenses'),
      },
      {
        value: '3',
        label: t('Net expenses (Expenses - Income)'),
      },
      {
        value: '4',
        label: t('Balance (Income - Expenses)'),
      },
    ];
  }, []);

  const [valueType, setValueType] = useState<ISelectOption>(selectValueTypeOptions[2]);
  const [visualizationType, setVisualizationType] = useState<'table' | 'graph'>('graph');
  const [isShowParams, setIsShowParams] = useState<boolean>(false);

  const { dynamicsReport, dynamicsReportLoadState, dynamicsReportFilter: filter } = reportsRepository;

  const handleSelectValueType = (value: ISelectOption | null) => {
    if (value) {
      setValueType(value);
    }
  };

  const handleChangeVisualizationType = (event: any, value: 'table' | 'graph' | null) => {
    if (value !== null) {
      setVisualizationType(value);
    }
  };

  const handleToggleParams = () => {
    setIsShowParams(!isShowParams);
  };

  //
  const moneysOptions: IOption[] = useMemo(() => {
    return moneysRepository.moneys.map(money => ({ value: money.id, label: money.symbol }));
  }, [moneysRepository.moneys]);

  const usingTypeOptions = useMemo<IOption[]>(
    () => [
      { value: '1', label: t('Only') },
      { value: '2', label: t('Except') },
    ],
    []
  );

  const selectContractorsOptions = useMemo<ISelectOption[]>(
    () => contractorsRepository.contractors.map(({ id: value, name: label }) => ({ value, label })),
    [contractorsRepository.contractors]
  );

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

  const selectTagsOptions = useMemo<ISelectOption[]>(() => {
    return tagsRepository.tags.map(({ id: value, name: label }) => ({ value, label }));
  }, [tagsRepository.tags]);

  const selectMoreOptions = useMemo<ISelectOption[]>(() => {
    return [
      {
        value: 'isUseReportPeriod',
        label: t('Use report period'),
      },
      {
        value: 'isUsePlanningOperation',
        label: t('Consider planned transactions'),
      },
    ];
  }, []);

  const setRange = useCallback(
    (values: [Date, Date]) => {
      reportsRepository.setDynamicsReportFilter({ range: values });
    },
    [reportsRepository]
  );

  const setMoney = ({ value }: IOption) => {
    const money = moneysRepository.get(value);
    if (money) {
      reportsRepository.setDynamicsReportFilter({ money });
    }
  };

  const setContractorsUsingType = ({ value }: IOption) => {
    reportsRepository.setDynamicsReportFilter({ contractorsUsingType: value });
  };

  const setContractors = (contractors: ISelectOption[]) => {
    reportsRepository.setDynamicsReportFilter({ contractors: contractors.map(({ value }) => value) });
  };

  const setAccountsUsingType = ({ value }: IOption) => {
    reportsRepository.setDynamicsReportFilter({ accountsUsingType: value });
  };

  const setAccounts = (accounts: ISelectOption[]) => {
    reportsRepository.setDynamicsReportFilter({ accounts: accounts.map(({ value }) => value) });
  };

  const setCategoriesUsingType = ({ value }: IOption) => {
    reportsRepository.setDynamicsReportFilter({ categoriesUsingType: value });
  };

  const setCategories = (categories: ISelectOption[]) => {
    reportsRepository.setDynamicsReportFilter({ categories: categories.map(({ value }) => value) });
  };

  const setTagsUsingType = ({ value }: IOption) => {
    reportsRepository.setDynamicsReportFilter({ tagsUsingType: value });
  };

  const setTags = (tags: ISelectOption[]) => {
    reportsRepository.setDynamicsReportFilter({ tags: tags.map(({ value }) => value) });
  };

  const setMore = (more: ISelectOption[]) => {
    reportsRepository.setDynamicsReportFilter({ more: more.map(({ value }) => value as any) });
  };

  useEffect(() => {
    if (!moneysRepository.moneys.find(money => filter.money === money)) {
      reportsRepository.setDynamicsReportFilter({
        money: moneysRepository.moneys[0],
        categoriesUsingType: UsingType.Exclude,
        categories: [
          categoriesRepository.getCategoryByPrototype('1'),
          categoriesRepository.getCategoryByPrototype('10'),
          categoriesRepository.getCategoryByPrototype('20'),
        ].map(({ id }) => id),
      });
    }
  }, [
    categoriesRepository,
    filter.money,
    moneysRepository.moneys,
    projectsRepository.currentProject,
    reportsRepository,
  ]);

  return (
    <div className={styles.layout}>
      <HeaderLayout title={t('Reports — Dynamics')} />
      <main className={styles.content}>
        <div className={clsx(styles.content__panel, styles.panel)}>
          <div className={clsx(styles.panel__toolbar, styles.toolbar)}>
            <div className={styles.toolbar__buttons}>
              <Select<false>
                value={valueType}
                isClearable={false}
                options={selectValueTypeOptions}
                onChange={handleSelectValueType}
                className={styles.valueTypeSelect}
              />

              <ToggleButtonGroup
                size="small"
                value={visualizationType}
                exclusive
                onChange={handleChangeVisualizationType}
              >
                <ToggleButton value="table" centerRipple={false}>
                  <TableIcon />
                </ToggleButton>
                <ToggleButton value="graph">
                  <BarChart07Icon />
                </ToggleButton>
              </ToggleButtonGroup>

              <Button variant="secondaryGray" onClick={handleToggleParams}>
                {t('Parameters')}
              </Button>
            </div>
          </div>

          {isShowParams && (
            <div className={clsx(styles.panel__filter, styles.filter)}>
              <RangeSelect<true> values={filter.range} isStrict onChange={setRange} />

              <InlineSelect label={filter.money?.symbol ?? '<NA>'} options={moneysOptions} onChange={setMoney} />

              <div className={styles.filter_item}>
                <InlineSelect
                  label={usingTypeOptions.find(option => option.value === filter.accountsUsingType)!.label}
                  options={usingTypeOptions}
                  onChange={setAccountsUsingType}
                />

                <MultiSelect
                  label={t('Accounts')}
                  options={selectAccountsOptions}
                  values={selectAccountsOptions.filter(({ value }) => filter.accounts.includes(value))}
                  onChange={setAccounts}
                  className={styles.multiSelect}
                />
              </div>

              <div className={styles.filter_item}>
                <InlineSelect
                  label={usingTypeOptions.find(option => option.value === filter.contractorsUsingType)!.label}
                  options={usingTypeOptions}
                  onChange={setContractorsUsingType}
                />

                <MultiSelect
                  label={t('Counterparties')}
                  options={selectContractorsOptions}
                  values={selectContractorsOptions.filter(({ value }) => filter.contractors.includes(value))}
                  onChange={setContractors}
                  className={styles.multiSelect}
                />
              </div>

              <div className={styles.filter_item}>
                <InlineSelect
                  label={usingTypeOptions.find(option => option.value === filter.categoriesUsingType)!.label}
                  options={usingTypeOptions}
                  onChange={setCategoriesUsingType}
                />

                <MultiSelect
                  label={t('Categories')}
                  options={selectCategoriesOptions}
                  values={selectCategoriesOptions.filter(({ value }) => filter.categories.includes(value))}
                  onChange={setCategories}
                  className={styles.multiSelect}
                />
              </div>

              <div className={styles.filter_item}>
                <InlineSelect
                  label={usingTypeOptions.find(option => option.value === filter.tagsUsingType)!.label}
                  options={usingTypeOptions}
                  onChange={setTagsUsingType}
                />

                <MultiSelect
                  label={t('Tags')}
                  options={selectTagsOptions}
                  values={selectTagsOptions.filter(({ value }) => filter.tags.includes(value))}
                  onChange={setTags}
                  className={styles.multiSelect}
                />
              </div>

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

        {dynamicsReportLoadState.isPending() && (
          <div className={styles.loader}>
            <img src={loadingSvg} alt="Loading" />
          </div>
        )}

        <div className={styles.content__visualization}>
          {dynamicsReportLoadState.isDone() &&
            (visualizationType === 'table' ? (
              <DynamicsTable valueType={valueType.value} />
            ) : (
              <DynamicsGraph valueType={valueType.value} />
            ))}
        </div>
      </main>
    </div>
  );
});

export default DynamicsReport;
