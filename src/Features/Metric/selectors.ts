import { createSelector } from '@reduxjs/toolkit';

import { MetricSliceState } from './types';
import { handleFirstDataSet, handleMultiDataSet } from './utils/handleGraphData';

const metricsState = (state: MetricSliceState) => state.metrics;
const graphDataState = (state: MetricSliceState) => state.graphData;

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
