import React, { FC, useState, useEffect } from 'react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
} from 'recharts';
import {
  ApolloClient,
  ApolloProvider,
  useQuery,
  gql,
  InMemoryCache,
} from '@apollo/client';
import LinearProgress from '@material-ui/core/LinearProgress';
import Typography from '@material-ui/core/Typography';

import { useAppSelector } from '../../reducers/hooks';

const client = new ApolloClient({
  uri: 'https://react.eogresources.com/graphql',
  cache: new InMemoryCache(),
});

const query = gql`
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

type Measurements = {
  metric: string
  at: number
  value: number
  unit: string
};
type MetricGraphData = {
  metric: string;
  measurements: Measurements[];
};
type MetricGraphResponse = {
  getMultipleMeasurements: MetricGraphData[];
};

interface MetricGraphRequest {
  metricName: string;
  after: number;
}

const MetricGraph: FC = () => {
  const selectedMetrics = useAppSelector(state => state.metrics.metrics);
  const [metricQuery, setMetricQuery] = useState<MetricGraphRequest[]>([]);

  useEffect(() => {
    if (!selectedMetrics.length) {
      return;
    }
    const minutes = 30;
    const currentTime = new Date();
    const after = new Date(currentTime.getTime() - minutes * 60000).valueOf();
    setMetricQuery(selectedMetrics.map((metricName: string) => ({
      metricName,
      after,
    })));
  }, [selectedMetrics]);

  const { loading, error, data } = useQuery<MetricGraphResponse>(query, {
    variables: { input: [...metricQuery] },
  });
  if (loading) return <LinearProgress />;
  if (error) return <Typography color="error">{error}</Typography>;
  if (!data) return null;
  console.log('metricQuery', data);
  const { getMultipleMeasurements: graphMeasurements } = data;

  const getData = () => {
    console.log('graphMeasurements', graphMeasurements);
    if (!graphMeasurements.length) {
      return [];
    }

    const graphSet = graphMeasurements[0].measurements.map(m => ({
      parseAt: new Date(m.at).toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true }),
      at: m.at,
      [m.metric]: m.value,
      [m.unit]: m.value,
    }));

    if (graphMeasurements.length > 1) {
      graphSet.forEach(dataSet => {
        graphMeasurements.forEach((metric) => {
          const metricWithExistingAt = metric.measurements.find(m => m.at === dataSet.at);
          if (metricWithExistingAt) {
            dataSet[metric.metric] = metricWithExistingAt.value;
          }
        });
      });
    }
    console.log('graphSet', graphSet);
    return graphSet;
  };

  return (
    <>
      {selectedMetrics.length ? (
        <ResponsiveContainer height={500}>
          <LineChart data={getData()}>
            <XAxis dataKey="parseAt" interval='preserveStart' padding={{ left: 30, right: 30 }} />
            {
              graphMeasurements.map((graph) => (
                <YAxis
                  interval="preserveStart"
                  key={`yAxis-${graph.metric}`}
                  yAxisId={graph.metric}
                  label={{
                    value: graph.measurements[0].unit,
                    position: 'insideLeft',
                    angle: -90,
                  }}
                />
              ))
            }
            {
              graphMeasurements.map((graph) => (
                <Line
                  key={`line-${graph.metric}`}
                  yAxisId={graph.metric}
                  type="monotone"
                  dataKey={graph.metric}
                  stroke="#82ca9d"
                  dot={false}
                />
              ))
            }
            <CartesianGrid strokeDasharray="1" />
            <Tooltip />
            <Legend />
          </LineChart>
        </ResponsiveContainer>
      ) : null}
    </>
  );
};

export default () => (
  <ApolloProvider client={client}>
    <MetricGraph />
  </ApolloProvider>
);
