import React, { FC } from 'react';
import {
  ApolloClient,
  ApolloProvider,
  useQuery,
  gql,
  InMemoryCache,
} from '@apollo/client';
// import LinearProgress from '@material-ui/core/LinearProgress';
import Typography from '@material-ui/core/Typography';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import { makeStyles } from '@material-ui/core/styles';

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

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    width: theme.spacing(30),
  },
}));

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
  const classes = useStyles();
  const { data } = useQuery<MetricCardsResponse>(query, {
    variables: { metricName: metric },
    pollInterval: 5000,
  });
  // if (loading) return <LinearProgress />;
  // handle error with toast
  // if (error) return <Typography color="error">{error}</Typography>;
  if (!data) return null;
  const { value, unit } = data.getLastKnownMeasurement;

  return (
    <Card className={classes.root}>
      <CardContent>
        <Typography variant="h6" component="h2">
          {metric}
        </Typography>
        <Typography variant="body2" component="p">
          {value} {unit}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default ({ metric }: SelectedMetric) => (
  <ApolloProvider client={client}>
    <MetricCards metric={metric} />
  </ApolloProvider>
);
