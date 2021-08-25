import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface SelectedMetrics {
  metricName: string,
  stroke?: string,
  after?: number,
}
interface MetricSliceState {
  metrics: SelectedMetrics[];
  metricQuery: SelectedMetrics[];
  uniqueUnits: string[];
  startTime: number;
}
const initialState: MetricSliceState = {
  metrics: [],
  metricQuery: [],
  uniqueUnits: [],
  startTime: 0,
};

export const metricSlice = createSlice({
  name: 'metric',
  initialState,
  reducers: {
    addMetric: (state, action: PayloadAction<SelectedMetrics>) => {
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
        (metric: SelectedMetrics) => metric.metricName !== action.payload,
      );
      state.metricQuery = state.metricQuery.filter(
        (metric: SelectedMetrics) => metric.metricName !== action.payload,
      );
    },
    setStartTime: (state, action: PayloadAction<number>) => {
      state.startTime = action.payload;
    },
    clearSelectedMetrics: (state) => {
      state.metrics = [];
      state.metricQuery = [];
      state.startTime = 0;
    },
    addUniqueUnit: (state, action: PayloadAction<string>) => {
      state.uniqueUnits = [...state.uniqueUnits, action.payload];
    },
  },
});

export const {
  addMetric,
  deleteMetric,
  setStartTime,
  clearSelectedMetrics,
  addUniqueUnit,
} = metricSlice.actions;
