import React, { FC } from 'react';
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
query ($input: [MeasurementQuery]) {
  getMultipleMeasurements(input: $input) {
    metric
    measurements {
      metric
      at
      value
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

const MetricGraph: FC = () => {
  const selectedMetrics = useAppSelector(state => state.metrics.metrics);
  const minutes = 30;
  const currentTime = new Date();
  const after = new Date(currentTime.getTime() - minutes * 60000).valueOf();

  const measurementQuery = selectedMetrics.length
    ? selectedMetrics.map((metricName: string) => ({
      metricName,
      after,
    }))
    : [];
  console.log('arr', measurementQuery);
  const { loading, error, data } = useQuery<MetricGraphResponse>(query, {
    variables: { input: measurementQuery },
  });
  // console.log('data', data);
  if (loading) return <LinearProgress />;
  if (error) return <Typography color="error">{error}</Typography>;
  if (!data) return null;
  return <div>graph</div>;
};

export default () => (
  <ApolloProvider client={client}>
    <MetricGraph />
  </ApolloProvider>
);
