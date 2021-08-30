export class Metric {
  metric!: string;
}

export type MetricList = {
  getMetrics: Metric[];
};

export type MetricListResponse = {
  getMetrics: MetricList;
};

type MetricData = {
  metric: string;
  at: number;
  value: number;
  unit: string;
};

export type MetricTableCellResponse = {
  getLastKnownMeasurement: MetricData;
};

export interface SelectedMetric {
  metric: string;
}

export type MetricGraphData = {
  metric: string;
  measurements: MetricData[];
};

export type MetricGraphResponse = {
  getMultipleMeasurements: MetricGraphData[];
  newMeasurement: MetricData;
};

export interface GraphDataset {
  [key: string]: number;
  at: number;
}