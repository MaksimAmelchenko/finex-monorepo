import React, { useCallback, useMemo, useState } from 'react';
import { Bar, BarDatum } from '@nivo/bar';
import { add, differenceInMonths, format, formatISO } from 'date-fns';
import { observer } from 'mobx-react-lite';

import { CategoriesRepository } from '../../../../stores/categories-repository';
import { ReportsRepository } from '../../../../stores/reports-store';
import { formatDate } from '../../../../lib/core/i18n';
import { getValue } from '../../get-value';
import { useStore } from '../../../../core/hooks/use-store';

interface DynamicsTableProps {
  valueType: string;
}

export const DynamicsGraph = observer<DynamicsTableProps>(({ valueType }) => {
  const reportsRepository = useStore(ReportsRepository);
  const categoriesRepository = useStore(CategoriesRepository);

  const { dynamicsReport, filter } = reportsRepository;

  const rangeLength = differenceInMonths(filter.range[1], filter.range[0]);

  const months: Date[] = [...Array(rangeLength + 1)].map((_, index) => add(filter.range[0], { months: index }));

  if (!dynamicsReport) {
    return null;
  }

  const data = useMemo<BarDatum[]>(() => {
    if (!reportsRepository.dynamicsReport) {
      return [];
    }
    const result: any[] = [];
    months.forEach(month => {
      const item: any = { date: month.getTime() };
      reportsRepository.dynamicsReport!.nodes.forEach(node => {
        const value = Math.round(getValue(node[format(month, 'yyyyMM')], valueType) ?? 0);
        if (value) {
          item[node.category!.id] = value;
        }
      });
      result.push(item);
    });
    return result;
  }, [reportsRepository.dynamicsReport, valueType]);

  const keys = useMemo<string[]>(() => {
    const categories: any[] = [];
    reportsRepository.dynamicsReport!.nodes.forEach(({ category, id, ...rest }) => {
      const { amount, count } = Object.keys(rest).reduce(
        (acc, key) => {
          //  "202201": [10, 200] ?
          if (key.match(/^\d{6}$/) && Array.isArray(rest[key]) && rest[key].length === 2) {
            acc.amount += getValue(rest[key], valueType) ?? 0;
            acc.count++;
          }
          return acc;
        },
        { amount: 0, count: 0 }
      );

      categories.push({ categoryId: category!.id, avg: amount / count });
    });
    return categories.sort((a, b) => b.avg - a.avg).map(({ categoryId }) => categoryId);
  }, [reportsRepository.dynamicsReport, valueType]);

  const [size, setSize] = useState<any>({ width: 0, height: 0 });
  const refCallback = useCallback((node: HTMLInputElement | null) => {
    if (node) {
      setSize({ width: node.offsetWidth, height: node.offsetHeight });
    }
  }, []);

  return (
    <div style={{ height: 'calc(100% - 8px)' }} ref={refCallback}>
      {size.width && (
        <Bar
          margin={{ top: 0, right: 32, bottom: 56, left: 64 }}
          width={size.width}
          height={size.height}
          indexBy="date"
          data={data}
          keys={keys}
          enableLabel={false}
          colors={{ scheme: 'dark2' }}
          tooltip={params => {
            const { id, value } = params;
            return (
              <div
                style={{
                  padding: 12,
                  color: '#fff',
                  background: '#222222',
                }}
              >
                <span>{categoriesRepository.get(String(id))?.name}</span>
                <br />
                <strong>{value}</strong>
              </div>
            );
          }}
          axisBottom={{
            format: function (value: number) {
              return formatDate(formatISO(new Date(value)), 'date.formats.month');
            },
          }}
        />
      )}
    </div>
  );
});
