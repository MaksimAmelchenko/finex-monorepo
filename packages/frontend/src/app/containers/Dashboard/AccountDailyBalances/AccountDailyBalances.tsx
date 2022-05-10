import React, { useEffect, useMemo, useState } from 'react';
import clsx from 'clsx';
import { ResponsiveLine, PointTooltipProps } from '@nivo/line';
import { linearGradientDef } from '@nivo/core';
import { observer } from 'mobx-react-lite';
import { parseISO } from 'date-fns';

import { BalanceRepository } from '../../../stores/balance-repository';
import { IAccount } from '../../../types/account';
import { IMoney } from '../../../types/money';
import { InlineSelect, IOption, InlineDateRangePicker } from '@finex/ui-kit';
import { MoneysRepository } from '../../../stores/moneys-repository';
import { ParamsStore } from '../../../stores/params-store';
import { TDate, TDateTime } from '../../../types';
import { formatDate, getT, toCurrency } from '../../../lib/core/i18n';
import { useStore } from '../../../core/hooks/use-store';
import { CircularIndeterminate } from '@finex/ui-kit';

import styles from './AccountDailyBalances.module.scss';

const t = getT('AccountDailyBalances');

function Tooltip({ point }: PointTooltipProps): JSX.Element {
  const {
    serieId,
    data: { xFormatted, yFormatted },
  } = point;

  return (
    <div className={styles.tooltip}>
      <div className={styles.tooltip__name}>{serieId}</div>
      <div className={styles.tooltip__date}>{formatDate(xFormatted as TDateTime)}</div>
      <div className={styles.tooltip__amount}>{yFormatted}</div>
    </div>
  );
}

type AccountMap = Map<IAccount | null, { account: IAccount | null; data: { x: TDateTime; y: number }[] }>;

export const AccountDailyBalances = observer(() => {
  const balanceRepository = useStore(BalanceRepository);
  const moneysRepository = useStore(MoneysRepository);
  const paramsStore = useStore(ParamsStore);

  const { dBegin, dEnd } = paramsStore.params!.dashboard;
  const [range, setRange] = useState<[Date, Date]>([new Date(parseISO(dBegin)), new Date(parseISO(dEnd))]);

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
  }, [selectedMoney, range, balanceRepository]);

  const moneysOptions: IOption[] = useMemo(() => {
    return [
      { value: 'null', label: t('in original currency') },
      ...moneysRepository.moneys.map(money => ({ value: money.id, label: money.symbol })),
    ];
  }, [moneysRepository.moneys]);

  const dataByMoney: { money: IMoney; series: { id: string; data: { x: TDate; y: number }[] }[] }[] = useMemo(() => {
    if (!dailyBalances.length) {
      return [];
    }
    const obj = new Map<
      IMoney,
      {
        money: IMoney;
        accountMap: AccountMap;
      }
    >();

    dailyBalances
      .slice()
      .sort((a, b) => a.money.sorting - b.money.sorting)
      .forEach(({ money, account, dBalance, sum }) => {
        if (!obj.has(money)) {
          obj.set(money, {
            money,
            accountMap: new Map(),
          });
        }

        if (!obj.get(money)!.accountMap.has(account)) {
          obj.get(money)!.accountMap.set(account, {
            account,
            data: [],
          });
        }

        obj.get(money)!.accountMap.get(account)!.data.push({ x: dBalance, y: sum });
      });

    return Array.from(obj.values()).map(({ money, accountMap }) => {
      return {
        money,
        series: Array.from(accountMap.values())
          .filter(({ data }) => data.length > 2 || (data.length === 2 && data[0].y !== 0 && data[1].y !== 0))
          .map(({ account, data }) => ({
            id: account ? account.name : t('Total'),
            data,
          })),
      };
    });
  }, [dailyBalances]);

  return (
    <section className={styles.container}>
      <div className={clsx(styles.accountDailyBalances__header, styles.header)}>
        <h2 className={styles.header__title}>
          {t('Daily Balance')}

          <div className={styles.header__date}>
            <InlineDateRangePicker
              values={range}
              labels={[formatDate(range[0].toISOString()), formatDate(range[1].toISOString())]}
              onChange={setRange}
              todayButton={t('Today')}
            />
          </div>
        </h2>

        <div className={styles.header__options}>
          <InlineSelect
            label={moneysOptions.find(option => option.value === (selectedMoney ? selectedMoney.id : 'null'))!.label}
            options={moneysOptions}
            onChange={handleSelectMoney}
          />
        </div>
      </div>
      {!dailyBalancesLoadState.isDone() ? (
        <div className={styles.loader}>
          <CircularIndeterminate />
        </div>
      ) : (
        <>
          {dataByMoney.map(({ money, series }) => {
            return (
              <article className={styles.chart} key={money.id}>
                <ResponsiveLine
                  margin={{ top: 20, right: 200, bottom: 60, left: 80 }}
                  data={series}
                  animate
                  useMesh
                  xScale={{
                    type: 'time',
                    format: '%Y-%m-%d',
                    useUTC: false,
                    precision: 'day',
                  }}
                  xFormat="time:%Y-%m-%d"
                  yFormat={value => toCurrency(value as number, money.precision)}
                  yScale={{
                    type: 'linear',
                    stacked: false,
                    min: 'auto',
                  }}
                  axisLeft={{
                    legend: money.name,
                    legendOffset: 8,
                  }}
                  axisBottom={{
                    format: '%b %d',
                    tickValues: 'every 1 month',
                    legendOffset: -12,
                  }}
                  curve="linear"
                  pointSize={0}
                  tooltip={Tooltip}
                  legends={[
                    {
                      anchor: 'bottom-right',
                      direction: 'column',
                      justify: false,
                      translateX: 100,
                      translateY: 0,
                      itemsSpacing: 0,
                      itemDirection: 'left-to-right',
                      itemWidth: 80,
                      itemHeight: 20,
                      itemOpacity: 0.75,
                      symbolSize: 12,
                      symbolShape: 'circle',
                      symbolBorderColor: 'rgba(0, 0, 0, .5)',
                      effects: [
                        {
                          on: 'hover',
                          style: {
                            itemBackground: 'rgba(0, 0, 0, .03)',
                            itemOpacity: 1,
                          },
                        },
                      ],
                    },
                  ]}
                  enableArea={true}
                  defs={[
                    linearGradientDef('gradientA', [
                      { offset: 0, color: 'inherit' },
                      { offset: 40, color: 'inherit', opacity: 0 },
                    ]),
                  ]}
                  fill={[{ match: '*', id: 'gradientA' }]}
                />
              </article>
            );
          })}
        </>
      )}
    </section>
  );
});
