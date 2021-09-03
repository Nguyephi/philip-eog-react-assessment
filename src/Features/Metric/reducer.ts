import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import {
  MetricSliceState,
  MetricGraphData,
  SelectedMetricData,
} from './types';

const initialState: MetricSliceState = {
  metrics: [],
  metricQuery: [],
  graphData: [],
  // uniqueUnits: [],
  startTime: 0,
};

export const metricSlice = createSlice({
  name: 'metric',
  initialState,
  reducers: {
    addMetric: (state, action: PayloadAction<SelectedMetricData>) => {
      state.metrics = [...state.metrics, {
        metricName: action.payload.metricName,
        stroke: Math.floor(Math.random() * 16777215).toString(16),
      }];
      state.metricQuery = [...state.metricQuery, {
        metricName: action.payload.metricName,
        after: action.payload.after,
      }];
    },
    deleteMetric: (state, action: PayloadAction<string>) => {
      state.metrics = state.metrics.filter(
        (metric: SelectedMetricData) => metric.metricName !== action.payload,
      );
      state.metricQuery = state.metricQuery.filter(
        (metric: SelectedMetricData) => metric.metricName !== action.payload,
      );
    },
    setGraphData: (state, action: PayloadAction<MetricGraphData[]>) => {
      state.graphData = [...action.payload];
    },
    setStartTime: (state, action: PayloadAction<number>) => {
      state.startTime = action.payload;
    },
    clearSelectedMetrics: (state) => {
      state.metrics = [];
      state.metricQuery = [];
      state.graphData = [];
      // state.uniqueUnits = [];
      state.startTime = 0;
    },
    // addUniqueUnit: (state, action: PayloadAction<string>) => {
    //   state.uniqueUnits = [...state.uniqueUnits, action.payload];
    // },
  },
});

export const {
  addMetric,
  deleteMetric,
  setGraphData,
  setStartTime,
  clearSelectedMetrics,
  // addUniqueUnit,
} = metricSlice.actions;
