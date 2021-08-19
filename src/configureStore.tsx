import { configureStore } from '@reduxjs/toolkit';
import { metricSlice } from './reducers/metricReducer';

const store = configureStore({
  reducer: {
    metrics: metricSlice.reducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const selectMetrics = (state: RootState) => state.metrics.metrics;

export default store;
