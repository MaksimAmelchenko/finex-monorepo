import React, { useRef, useEffect } from 'react';

import { CanvasRenderer } from 'echarts/renderers';
import {
  LegendComponent,
  GridComponent,
  TooltipComponent,
  ToolboxComponent,
  TitleComponent,
  DataZoomComponent,
} from 'echarts/components';
import { LineChart, BarChart } from 'echarts/charts';
import {
  graphic,
  ECharts as EChartsClass,
  ComposeOption,
  SetOptionOpts,
  init,
  getInstanceByDom,
  use,
} from 'echarts/core';

import 'echarts/i18n/langRU';
import 'echarts/i18n/langDE';

import type { BarSeriesOption, LineSeriesOption, ScatterSeriesOption } from 'echarts/charts';
import type { TitleComponentOption, GridComponentOption } from 'echarts/components';

import { currentLocale } from '../../lib/core/i18n';

export type EChartsOption = ComposeOption<
  BarSeriesOption | LineSeriesOption | TitleComponentOption | GridComponentOption | ScatterSeriesOption
>;

export interface ReactEChartsProps {
  option: EChartsOption;
  settings?: SetOptionOpts;
  loading?: boolean;
  theme?: 'light' | 'dark';
  className?: string;
}

use([
  LegendComponent,
  LineChart,
  BarChart,
  GridComponent,
  TooltipComponent,
  TitleComponent,
  ToolboxComponent,
  DataZoomComponent,
  CanvasRenderer,
]);

export function ECharts({ option, settings, loading, theme, className }: ReactEChartsProps): JSX.Element {
  const chartRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Initialize chart
    let chart: EChartsClass | undefined;
    if (chartRef.current !== null) {
      chart = init(chartRef.current, theme, { locale: currentLocale().toUpperCase() });
    }

    // Add chart resize listener
    // ResizeObserver is leading to a bit janky UX
    function resizeChart() {
      chart?.resize();
    }
    window.addEventListener('resize', resizeChart);

    // Return cleanup function
    return () => {
      chart?.dispose();
      window.removeEventListener('resize', resizeChart);
    };
  }, [theme]);

  useEffect(() => {
    // Update chart
    if (chartRef.current !== null) {
      const chart = getInstanceByDom(chartRef.current);
      chart?.setOption(option, settings);
    }
  }, [option, settings, theme]);

  useEffect(() => {
    if (chartRef.current !== null) {
      const chart = getInstanceByDom(chartRef.current);
      loading === true ? chart?.showLoading() : chart?.hideLoading();
    }
  }, [loading, theme]);

  return <div ref={chartRef} style={{ width: '100%', height: '100%' }} className={className} />;
}

export { graphic };

export const colors: graphic.LinearGradient[] = [
  //
  generateLinearGradient('#444ce7', '#8098f9'),
  generateLinearGradient('#ec4a0a', '#fd853a'),
  generateLinearGradient('#475467', '#98a2b3'),
  // Purple
  generateLinearGradient('#6938EF', '#9B8AFB'),
  // Teal
  generateLinearGradient('#0E9384', '#2ED3B7'),
  generateLinearGradient('#dc6803', '#fdb022'),
  generateLinearGradient('#3e4784', '#717bbc'),
  generateLinearGradient('#039855', '#32d583'),
  generateLinearGradient('#d92d20', '#f97066'),
  generateLinearGradient('#BA24D5', '#E478FA'),
  //
];

function generateLinearGradient(color1: string, color2: string): graphic.LinearGradient {
  return new graphic.LinearGradient(0, 0, 0, 1, [
    {
      offset: 0,
      color: color1,
    },
    {
      offset: 1,
      color: color2,
    },
  ]);
}
