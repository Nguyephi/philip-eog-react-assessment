import { createSelector } from '@reduxjs/toolkit';

import {
  MetricSliceState,
  SelectedMetricData,
  MetricGraphData,
} from './types';

const metricsState = (state: MetricSliceState) => state.metrics;
const graphDataState = (state: MetricSliceState) => state.graphData;

const handleFirstDataSet = (graphData: { measurements: any[]; }[]) => {
  const chartData: any[] = [];
  graphData[0].measurements.forEach((m) => {
    chartData.push({
      at: m.at,
      [m.metric]: m.value,
    });
  });
  return chartData;
};

const handleMultiDataSet = (
  metrics: SelectedMetricData[],
  graphData: MetricGraphData[],
  dataSet: any[],
) => {
  const chartData = [...dataSet];
  metrics.forEach((metric, idx) => {
    if (!Object.prototype.hasOwnProperty.call(graphData[idx], metric.metricName)) {
      graphData[idx].measurements.forEach((m, mIdx) => {
        if (m?.at === chartData[mIdx]?.at) {
          chartData[mIdx] = {
            [m.metric]: m.value,
            ...chartData[mIdx],
          };
        }
      });
    }
  });
  return chartData;
};

export const getGraphData = createSelector(
  graphDataState,
  metricsState,
  (graphData, metrics) => {
    let chartData: any[] = [];
    if (!graphData || !graphData.length) {
      return [];
    }

    if (!chartData.length) {
      chartData = handleFirstDataSet(graphData);
    }

    if (metrics.length > 1
      && metrics.length === graphData.length) {
      chartData = handleMultiDataSet(metrics, graphData, chartData);
    }

    return chartData;
  },
);
