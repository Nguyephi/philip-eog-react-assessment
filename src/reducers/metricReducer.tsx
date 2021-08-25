import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface SelectedMetrics {
  metricName: string;
  stroke?: string;
  after?: number;
}

interface GraphDataset {
  [key: string]: number;
  at: number;
}
interface MetricSliceState {
  metrics: SelectedMetrics[];
  metricQuery: SelectedMetrics[];
  graphData: GraphDataset[];
  uniqueUnits: string[];
  startTime: number;
}
const initialState: MetricSliceState = {
  metrics: [],
  metricQuery: [],
  graphData: [],
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
    setGraphData: (state, action: PayloadAction<GraphDataset[]>) => {
      state.graphData = [...action.payload];
    },
    setStartTime: (state, action: PayloadAction<number>) => {
      state.startTime = action.payload;
    },
    clearSelectedMetrics: (state) => {
      state.metrics = [];
      state.metricQuery = [];
      state.startTime = 0;
    },
    setUniqueUnit: (state, action: PayloadAction<string>) => {
      state.uniqueUnits = state.uniqueUnits.filter(unit => unit !== action.payload);
    },
  },
});

export const {
  addMetric,
  deleteMetric,
  setGraphData,
  setStartTime,
  clearSelectedMetrics,
  setUniqueUnit,
} = metricSlice.actions;
