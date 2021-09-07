import {
  SelectedMetricData,
  MetricGraphData,
} from '../types';

export const handleFirstDataSet = (graphData: { measurements: any[]; }[]) => {
  const chartData: any[] = [];
  graphData[0].measurements.forEach((m) => {
    chartData.push({
      at: m.at,
      [m.metric]: m.value,
    });
  });
  return chartData;
};

export const handleMultiDataSet = (
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
