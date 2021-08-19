import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface MetricSliceState {
  metrics: string[];
}
const initialState: MetricSliceState = {
  metrics: [],
};

export const metricSlice = createSlice({
  name: 'metric',
  initialState,
  reducers: {
    addMetric: (state, action: PayloadAction<string>) => {
      state.metrics = [...state.metrics, action.payload];
    },
    deleteMetric: (state, action: PayloadAction<string>) => {
      state.metrics = state.metrics.filter((metric: string) => metric !== action.payload);
    },
    clearSelectedMetrics: (state) => {
      state.metrics = [];
    },
  },
});

export const { addMetric, deleteMetric, clearSelectedMetrics } = metricSlice.actions;
