import { gql } from '@apollo/client';

export const getMetricQuery = gql`
  query getMetrics {
    getMetrics
  }
`;

export const metricSelectQuery = gql`
  query ($metricName: String!) {
    getLastKnownMeasurement(metricName: $metricName) {
      metric
      at
      value
      unit
    }
  }
`;

export const metricGraphQuery = gql`
  query ($input: [MeasurementQuery]!) {
    getMultipleMeasurements(input: $input) {
      metric
      measurements {
        metric
        value
        at
        unit
      }
    }
  }
`;

export const metricGraphSubscription = gql`
  subscription newMeasurement {
    newMeasurement {
      metric
      at
      value
      unit
    }
  }
`;
