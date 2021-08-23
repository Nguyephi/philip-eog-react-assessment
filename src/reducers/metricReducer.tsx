import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface SelectedMetrics {
  metricName: string,
  stroke: string
}
interface MetricSliceState {
  metrics: SelectedMetrics[];
  uniqueUnits: string[];
}
const initialState: MetricSliceState = {
  metrics: [],
  uniqueUnits: [],
};

export const metricSlice = createSlice({
  name: 'metric',
  initialState,
  reducers: {
    addMetric: (state, action: PayloadAction<string>) => {
      state.metrics = [...state.metrics, {
        metricName: action.payload,
        stroke: Math.floor(Math.random() * 16777215).toString(16),
      }];
    },
    deleteMetric: (state, action: PayloadAction<string>) => {
      state.metrics = state.metrics.filter(
        (metric: SelectedMetrics) => metric.metricName !== action.payload,
      );
    },
    clearSelectedMetrics: (state) => {
      state.metrics = [];
    },
    addUniqueUnit: (state, action: PayloadAction<string>) => {
      state.uniqueUnits = [...state.uniqueUnits, action.payload];
    },
  },
});

export const {
  addMetric,
  deleteMetric,
  clearSelectedMetrics,
  addUniqueUnit,
} = metricSlice.actions;
