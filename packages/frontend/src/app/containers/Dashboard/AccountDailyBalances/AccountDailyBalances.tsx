import React, { useEffect, useMemo } from 'react';
import { Line } from '@nivo/line';
import { observer } from 'mobx-react-lite';

import { BalanceRepository } from '../../../stores/balance-repository';
import { getT } from '../../../lib/core/i18n';
import { useStore } from '../../../core/hooks/use-store';

const t = getT('Dashboard');

export const AccountDailyBalances = observer(() => {
  const balanceRepository = useStore(BalanceRepository);

  const { dailyBalances, dailyBalancesLoadState } = balanceRepository;

  useEffect(() => {
    balanceRepository.fetchDailyBalance().catch(console.error);
  }, []);

  const data = useMemo(() => {
    if (!dailyBalances.length) {
      return [];
    }
    const obj = new Map();
    const result: any[] = [];
    dailyBalances.forEach(balance => {
      if (balance.account) {
        if (!obj.has(balance.account)) {
          obj.set(balance.account, {
            id: balance.account.id,
            data: [],
          });
          result.push(obj.get(balance.account));
        }
        obj.get(balance.account).data.push({ x: balance.dBalance, y: balance.sum });
      }
    });

    return result;
  }, [dailyBalances]);

  if (dailyBalancesLoadState.isPending() && !dailyBalances.length) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <Line
        width={600}
        height={400}
        margin={{ top: 20, right: 20, bottom: 60, left: 80 }}
        enableSlices={false}
        data={data}
        xScale={{
          type: 'time',
          format: '%Y-%m-%d',
          useUTC: false,
          precision: 'day',
        }}
        xFormat="time:%Y-%m-%d"
        yScale={{
          type: 'linear',
          stacked: false,
        }}
        axisLeft={{
          legend: 'linear scale',
          legendOffset: 12,
        }}
        axisBottom={{
          format: '%b %d',
          tickValues: 'every 1 month',
          legend: 'time scale',
          legendOffset: -12,
        }}
        curve="monotoneX"
        pointSize={0}
        useMesh={true}
      />
    </div>
  );
});
