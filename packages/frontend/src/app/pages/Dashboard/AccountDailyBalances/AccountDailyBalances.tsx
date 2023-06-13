import React, { useEffect, useMemo, useState } from 'react';
import clsx from 'clsx';
import { observer } from 'mobx-react-lite';
import { parseISO } from 'date-fns';
import { LineSeriesOption } from 'echarts/charts';

import { BalanceRepository } from '../../../stores/balance-repository';
import { IAccount } from '../../../types/account';
import { IMoney } from '../../../types/money';
import { InlineDateRangePicker, InlineSelect, IOption } from '@finex/ui-kit';
import { MoneysRepository } from '../../../stores/moneys-repository';
import { ParamsStore } from '../../../stores/params-store';
import { ProjectsRepository } from '../../../stores/projects-repository';
import { TDate } from '../../../types';
import { colors, ECharts } from '../../../components/ECharts/ECharts';
import { formatDate, getT } from '../../../lib/core/i18n';
import { tooltipFormatter, transformAccountsBalances } from './helpers';
import { useStore } from '../../../core/hooks/use-store';

import styles from './AccountDailyBalances.module.scss';

type Amount = number;

const t = getT('AccountDailyBalances');

export const AccountDailyBalances = observer(() => {
  const balanceRepository = useStore(BalanceRepository);
  const moneysRepository = useStore(MoneysRepository);
  const paramsStore = useStore(ParamsStore);
  const projectsRepository = useStore(ProjectsRepository);

  const { startDate, endDate } = paramsStore.params!.outcome.accountDailyBalances;
  const [range, setRange] = useState<[Date, Date]>([new Date(parseISO(startDate)), new Date(parseISO(endDate))]);

  const [selectedMoney, setSelectedMoney] = useState<IMoney | null>(null);

  const { dailyBalances, dailyBalancesLoadState } = balanceRepository;

  const handleSelectMoney = (option: IOption) => {
    const money = moneysRepository.get(option.value) || null;
    setSelectedMoney(money);
  };

  useEffect(() => {
    balanceRepository
      .fetchDailyBalance({
        moneyId: selectedMoney?.id,
        range,
      })
      .catch(console.error);
  }, [selectedMoney, range, balanceRepository, projectsRepository.currentProject]);

  const moneysOptions: IOption[] = useMemo(() => {
    return [
      { value: 'null', label: t('in original currency') },
      ...moneysRepository.moneys.map(money => ({ value: money.id, label: money.symbol })),
    ];
  }, [moneysRepository.moneys]);

  const sourceByMoney: Array<{
    money: IMoney;
    accounts: IAccount[];
    dataset: {
      dimensions: string[];
      source: Array<Array<TDate | Amount>>;
    };
  }> = useMemo(() => {
    if (!dailyBalances.length) {
      return [];
    }

    /*
    [
      {
        money: ...
        accounts: [...]
        dataset: {
          dimensions: ['date', [account.id], [account.id], [account.id], [account.id], [account.id]]
          source: [
            ["2023-01-01", 1.2, 0, 1, 1.52, 1.6]
            ["2023-01-02", 1.5, 1, 2, 1.5, 1.3]
            ...
            ["2023-21-31", 2.5, 1, -1, 1.5, 0]
          ]
        }
      },
      ...
    ]
    */

    return dailyBalances
      .slice()
      .sort((a, b) => moneysRepository.moneys.indexOf(a.money) - moneysRepository.moneys.indexOf(b.money))
      .reduce<any>((acc, dailyBalance) => {
        const accountsBalances = dailyBalance.accounts.filter(
          ({ account, balances }) =>
            balances.length > 2 || (balances.length === 2 && balances[0].amount !== 0 && balances[1].amount !== 0)
        );
        if (accountsBalances.length) {
          const accounts = accountsBalances.map(({ account }) => account);

          acc.push({
            money: dailyBalance.money,
            accounts,
            dataset: {
              dimensions: ['date', ...accounts.map(account => account.id)],
              source: transformAccountsBalances(accountsBalances),
            },
          });
        }

        return acc;
      }, []);
  }, [dailyBalances, moneysRepository.moneys]);

  return (
    <section className={styles.root}>
      <div className={clsx(styles.root__header, styles.header)}>
        <h2 className={styles.header__title}>{t('Daily balance including planned transactions')}</h2>

        <div className={styles.header__options}>
          <InlineDateRangePicker
            values={range}
            labels={[formatDate(range[0].toISOString()), formatDate(range[1].toISOString())]}
            onChange={setRange}
            todayButton={t('Today')}
          />

          <InlineSelect
            label={moneysOptions.find(option => option.value === (selectedMoney ? selectedMoney.id : 'null'))!.label}
            options={moneysOptions}
            onChange={handleSelectMoney}
          />
        </div>
      </div>
      <div className={styles.root__content}>
        {sourceByMoney.map(({ money, accounts, dataset: { dimensions, source } }) => {
          // check is there series with negative values
          const isNegative = source.some(row => row.some((value, index) => index > 0 && (value as number) < 0));

          return (
            <article className={styles.chart} key={`${money.id}${isNegative}`}>
              <h4 className={styles.chart__title}>
                {money.name}, {money.symbol}
              </h4>
              <main className={clsx(styles.chart__main, isNegative && styles.chart__main_negative)}>
                <ECharts
                  loading={!dailyBalancesLoadState.isDone()}
                  option={{
                    legend: {
                      padding: [0, 0, 0, 0],
                    },
                    grid: isNegative
                      ? [
                          { bottom: '55%', right: '12px' },
                          { top: '55%', right: '12px' },
                        ]
                      : [{ right: '12px' }],
                    xAxis: isNegative
                      ? [
                          { type: 'time', gridIndex: 0 },
                          { type: 'time', gridIndex: 1 },
                        ]
                      : [{ type: 'time' }],
                    yAxis: isNegative
                      ? [
                          { gridIndex: 0, type: 'value' },
                          { gridIndex: 1, type: 'value' },
                        ]
                      : [{ type: 'value' }],
                    dataZoom: isNegative
                      ? [
                          { type: 'inside', xAxisIndex: [0, 1] },
                          { type: 'slider', xAxisIndex: [0, 1] },
                        ]
                      : [{ type: 'inside' }, { type: 'slider' }],
                    tooltip: {
                      trigger: 'axis',
                      axisPointer: {
                        type: 'cross',
                      },
                      formatter: tooltipFormatter,
                    },
                    axisPointer: {
                      link: [{ xAxisIndex: 'all' }],
                    },
                    dataset: [
                      {
                        dimensions,
                        source,
                      },
                      {
                        dimensions,
                        // leave only positive values
                        source: source.map(row =>
                          row.map((_, index) =>
                            index === 0 ? row[index] : (row[index] as number) > 0 ? row[index] : 0
                          )
                        ),
                      },
                      {
                        dimensions,
                        // leave only negative values
                        source: source.map(row =>
                          row.map((_, index) =>
                            index === 0 ? row[index] : (row[index] as number) < 0 ? row[index] : 0
                          )
                        ),
                      },
                    ],

                    series: [
                      ...accounts.map<LineSeriesOption>(({ id, name }, index) => {
                        return {
                          type: 'line',
                          name,
                          symbol: 'none',
                          stack: 'positive',
                          step: 'end',
                          lineStyle: {
                            width: 1,
                          },
                          areaStyle: {},
                          emphasis: {
                            focus: 'series',
                          },
                          encode: {
                            x: 'date',
                            y: id,
                          },
                          datasetIndex: 1,
                        };
                      }),
                      // generate next series only if there are negative values
                      ...(isNegative
                        ? accounts.map<LineSeriesOption>(({ id, name }, index) => {
                            return {
                              type: 'line',
                              name,
                              xAxisIndex: 1,
                              yAxisIndex: 1,
                              symbol: 'none',
                              stack: 'negative',
                              step: 'end',
                              lineStyle: {
                                width: 1,
                              },
                              areaStyle: {},
                              emphasis: {
                                focus: 'series',
                              },
                              encode: {
                                x: 'date',
                                y: id,
                              },
                              datasetIndex: 2,
                            };
                          })
                        : []),
                    ],
                    color: colors,
                  }}
                />
              </main>
            </article>
          );
        })}
      </div>
    </section>
  );
});
