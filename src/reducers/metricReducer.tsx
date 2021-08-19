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
  },
});

export const { addMetric } = metricSlice.actions;
