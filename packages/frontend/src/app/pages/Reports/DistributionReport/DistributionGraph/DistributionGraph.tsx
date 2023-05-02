import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { ComputedDatum, Sunburst } from '@nivo/sunburst';
import { observer } from 'mobx-react-lite';

import { Category } from '../../../../stores/models/category';
import { DistributionReportTableNode } from '../../../../types/report';
import { ReportsRepository } from '../../../../stores/reports-store';
import { getT, toCurrency } from '../../../../lib/core/i18n';
import { getValue } from '../../get-value';
import { useStore } from '../../../../core/hooks/use-store';

interface RawDatum {
  id: string;
  category?: Category;
  value?: number;
  amount: number;
  children?: RawDatum[];
}

interface DistributionGraphProps {
  valueType: string;
}

const t = getT('DistributionGraph');

export const DistributionGraph = observer<DistributionGraphProps>(({ valueType }) => {
  const reportsRepository = useStore(ReportsRepository);
  const [data, setData] = useState<RawDatum | null>(null);

  const { distributionReport } = reportsRepository;

  const fullData = useMemo<RawDatum>(() => {
    if (!distributionReport) {
      return {
        id: 'root',
        amount: 0,
        children: [],
      };
    }

    function decode(nodes: DistributionReportTableNode[]): RawDatum[] {
      return nodes
        .map(node => {
          const { id, category, nodes } = node;
          const children = nodes ? decode(nodes) : undefined;
          // set value only for leaves
          const value = children ? undefined : Math.round(getValue(node.amount, valueType));
          const amount = children ? children.reduce((acc, item) => acc + item.amount, 0) : value!;
          return {
            id,
            category,
            amount,
            value,
            children,
          };
        })
        .sort((a, b) => b.amount - a.amount);
    }

    const { nodes, footer } = distributionReport;
    return {
      id: 'root',
      amount: Math.round(getValue(footer.total, valueType)),
      children: nodes ? decode(nodes) : undefined,
    };
  }, [distributionReport, valueType]);

  useEffect(() => {
    setData(fullData);
  }, [fullData]);

  const [size, setSize] = useState<any>({ width: 0, height: 0 });
  const refCallback = useCallback((node: HTMLInputElement | null) => {
    if (node) {
      setSize({ width: node.offsetWidth, height: node.offsetHeight });
    }
  }, []);

  const handleClick = (datum: ComputedDatum<RawDatum>, event: React.MouseEvent) => {
    event.stopPropagation();
    const data = fullData.children ? flatten(fullData.children).find(item => item.id === datum.id) : undefined;

    if (data && data.children) {
      setData(data);
    }
  };

  const handleReset = () => {
    setData(fullData);
  };

  console.log({ data });

  if (!data) {
    return null;
  }

  return (
    <div style={{ height: 'calc(100% - 8px)' }} ref={refCallback} onClick={handleReset}>
      {size.width && (
        <Sunburst<RawDatum>
          margin={{ top: 8, right: 8, bottom: 8, left: 8 }}
          width={size.width}
          height={size.height}
          data={data}
          tooltip={CustomTooltip}
          onClick={handleClick}
          // colors={customPalette}
          childColor={{ from: 'color', modifiers: [['brighter', 0.2]] }}
          borderWidth={1}
          enableArcLabels={true}
          arcLabelsSkipAngle={10}
        />
      )}
    </div>
  );
});

const CustomTooltip = ({ id, value, data: { category } }: ComputedDatum<RawDatum>) => {
  return (
    <div
      style={{
        padding: 12,
        color: '#181826',
        background: '#ffffff',
        border: '1px solid #dcdce4',
      }}
    >
      <span>{category?.name || t('Others')}</span>
      <br />
      <strong>{toCurrency(value, { precision: 0 })}</strong>
    </div>
  );
};

function flatten(children: RawDatum[]): RawDatum[] {
  return children.reduce<RawDatum[]>((acc, item) => {
    if (item.children) {
      return [...acc, item, ...flatten(item.children)];
    }
    return [...acc, item];
  }, []);
}
