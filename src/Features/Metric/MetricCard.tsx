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
import Card from '@material-ui/core/Card';

const client = new ApolloClient({
  uri: 'https://react.eogresources.com/graphql',
  cache: new InMemoryCache(),
});

const query = gql`
  query ($metricName: String!) {
    getLastKnownMeasurement(metricName: $metricName) {
      metric
      at
      value
      unit
    }
  }
`;

type MetricCardData = {
  metric: string;
  at: number;
  value: number;
  unit: string;
};
type MetricCardsResponse = {
  getLastKnownMeasurement: MetricCardData;
};

interface SelectedMetric {
  metric: string;
}

const MetricCards: FC<SelectedMetric> = ({ metric }: SelectedMetric) => {
  const { loading, error, data } = useQuery<MetricCardsResponse>(query, {
    variables: { metricName: metric },
    pollInterval: 5000,
  });
  if (loading) return <LinearProgress />;
  if (error) return <Typography color="error">{error}</Typography>;
  if (!data) return null;
  const { value, unit } = data.getLastKnownMeasurement;

  return (
    <Card>
      <Typography variant="h5" component="h2">
        {metric}
      </Typography>
      <Typography variant="body2" component="p">
        {value} {unit}
      </Typography>
    </Card>
  );
};

export default ({ metric }: SelectedMetric) => (
  <ApolloProvider client={client}>
    <MetricCards metric={metric} />
  </ApolloProvider>
);
