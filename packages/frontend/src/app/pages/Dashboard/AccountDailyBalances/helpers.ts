import { formatDate, toNumber } from '../../../lib/core/i18n';
import { TDate } from '../../../types';
import { Account } from '../../../stores/models/account';

type AccountId = string;

export function tooltipFormatter(callbackDataParams: any[]): string | HTMLElement | HTMLElement[] {
  // change series order
  const params = callbackDataParams.slice().reverse();
  const seriesMap = params.reduce<Map<AccountId, { marker: string; name: string; value: number }>>((acc, param) => {
    const {
      dimensionNames,
      seriesName,
      marker,
      encode: {
        y: [dimensionIndex],
      },
      value,
    } = param;
    const dimensionId = dimensionNames[dimensionIndex];
    const series = acc.get(dimensionId);
    if (!series) {
      acc.set(dimensionId, { marker, name: seriesName, value: value[dimensionIndex] });
    } else {
      series.value = series.value || value[dimensionIndex];
    }
    return acc;
  }, new Map());

  let tooltipText = formatDate(params[0].value[0] as any) + '<br/>';
  Array.from(seriesMap.values()).forEach(({ marker, name, value }) => {
    tooltipText += `${marker} ${name}: ${toNumber(value, { precision: 0 })}<br/>`;
  });

  return tooltipText;
}

function generateDates(startDate: TDate, endDate: TDate): TDate[] {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const result: TDate[] = [];

  while (start <= end) {
    result.push(start.toISOString().slice(0, 10));
    start.setDate(start.getDate() + 1);
  }

  return result;
}

type Amount = number;

function fillMissingBalances(
  balances: Array<{
    date: TDate;
    amount: Amount;
  }>,
  allDates: TDate[]
): Record<TDate, Amount> {
  const filledBalances: Record<TDate, Amount> = {};
  let lastIndex = 0;

  for (const date of allDates) {
    if (date === balances[lastIndex].date) {
      filledBalances[date] = balances[lastIndex].amount;
      lastIndex++;
    } else {
      filledBalances[date] = lastIndex > 0 ? balances[lastIndex - 1].amount : 0;
    }
  }

  return filledBalances;
}

interface AccountBalance {
  account: Account;
  balances: Array<{
    date: TDate;
    amount: Amount;
  }>;
}

export function transformAccountsBalances(accountBalances: AccountBalance[]): (TDate | Amount)[][] {
  const { balances } = accountBalances[0];
  const allDates = generateDates(balances[0].date, balances[balances.length - 1].date);

  // Create an object with date keys and balance values for each account
  const accountBalanceMap = accountBalances.reduce<Record<AccountId, Record<TDate, Amount>>>(
    (acc, { account, balances }) => {
      acc[account.id] = fillMissingBalances(balances, allDates);
      return acc;
    },
    {}
  );

  return allDates.reduce<Array<Array<TDate | Amount>>>((acc, date) => {
    const row = accountBalances.reduce<Array<TDate | Amount>>(
      (acc, { account }) => {
        acc.push(accountBalanceMap[account.id][date]);
        return acc;
      },
      [date]
    );

    acc.push(row);
    return acc;
  }, []);
}
