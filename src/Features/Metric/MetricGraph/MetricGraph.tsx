import React, { FC, useState, useEffect } from 'react';
import {
  ResponsiveContainer,
  LineChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Line,
  Legend,
} from 'recharts';
import {
  ApolloClient,
  ApolloProvider,
  useQuery,
  gql,
  InMemoryCache,
  split,
  HttpLink,
} from '@apollo/client';
import { getMainDefinition } from '@apollo/client/utilities';
import { WebSocketLink } from '@apollo/client/link/ws';
import LinearProgress from '@material-ui/core/LinearProgress';
import Typography from '@material-ui/core/Typography';

import { useAppSelector } from '../../../reducers/hooks';

const httpLink = new HttpLink({
  uri: 'https://react.eogresources.com/graphql',
});

const wsLink = new WebSocketLink({
  uri: 'ws://react.eogresources.com/graphql',
  options: {
    reconnect: true,
  },
});

const splitLink = split(
  ({ query }) => {
    const definition = getMainDefinition(query);
    return (
      definition.kind === 'OperationDefinition'
      && definition.operation === 'subscription'
    );
  },
  wsLink,
  httpLink,
);

const client = new ApolloClient({
  link: splitLink,
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

const subscription = gql`
  subscription newMeasurement {
    newMeasurement {
      metric
      at
      value
      unit
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
  newMeasurement: Measurements;
};

interface MetricGraphRequest {
  metricName: string;
  after: number;
}

const MetricGraph: FC = () => {
  const selectedMetrics = useAppSelector(state => state.metrics.metrics);
  const [metricQuery, setMetricQuery] = useState<MetricGraphRequest[]>([]);
  const [startTime, setStartTime] = useState<number>(0);

  useEffect(() => {
    if (!selectedMetrics.length) {
      setStartTime(0);
      return;
    }
    const minutes = 30;
    const currentTime = new Date();
    const after = startTime > 0
      ? startTime
      : new Date(currentTime.getTime() - minutes * 60000).valueOf();
    const selectedMetricQuery = selectedMetrics.map(({ metricName }) => ({
      metricName,
      after,
    }));
    setMetricQuery(selectedMetricQuery);
  }, [selectedMetrics]);

  const { subscribeToMore, ...result } = useQuery<MetricGraphResponse>(query, {
    variables: { input: [...metricQuery] },
  });
  const { loading, error, data } = result;
  if (loading) return <LinearProgress />;
  if (error) return <Typography color="error">{error}</Typography>;
  if (!data || !selectedMetrics.length) return null;

  const { getMultipleMeasurements: graphMeasurements } = data;

  if (graphMeasurements.length) {
    subscribeToMore({
      document: subscription,
      variables: null,
      updateQuery: (
        prev,
        { subscriptionData },
      ): MetricGraphResponse => {
        if (!subscriptionData) return prev;
        const newFeedItem = subscriptionData.data;
        const { metric, at } = newFeedItem.newMeasurement;
        const { getMultipleMeasurements } = prev;
        const selectedMeasurement: MetricGraphData | undefined = getMultipleMeasurements?.find(
          m => m.metric === metric,
        );
        if (!selectedMeasurement) return prev;
        const measurements = [...selectedMeasurement.measurements];
        if (at > measurements[measurements.length - 1].at) {
          measurements.push(newFeedItem.newMeasurement);
        }
        const newMulti = getMultipleMeasurements.map(m => {
          const temp = { ...m };
          if (m.metric !== metric) {
            return m;
          }
          temp.measurements = measurements;
          return temp;
        });
        prev = {
          ...prev,
          getMultipleMeasurements: newMulti,
        };
        return { ...prev };
      },
    });
  }

  const formatXAxis = (tickItem: number) => new Date(tickItem).toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true });

  const handleFirstDataSet = () => {
    const chartData: any[] = [];
    if (!graphMeasurements) {
      return [];
    }
    graphMeasurements[0].measurements.forEach((m) => {
      chartData.push({
        at: m.at,
        [m.metric]: m.value,
      });
    });
    return chartData;
  };

  const handleMultiDataSet = (dataSet: any[]) => {
    const chartData = [...dataSet];
    if (!graphMeasurements) {
      return [];
    }
    selectedMetrics.forEach((metric, idx) => {
      if (!Object.prototype.hasOwnProperty.call(chartData[idx], metric.metricName)) {
        graphMeasurements[idx].measurements.forEach((m, mIdx) => {
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

  const getChartData = () => {
    let chartData: any[] = [];
    if (!graphMeasurements || !graphMeasurements.length) {
      return [];
    }

    if (!chartData.length) {
      chartData = handleFirstDataSet();
    }

    if (!loading && selectedMetrics.length > 1
      && selectedMetrics.length === graphMeasurements.length) {
      chartData = handleMultiDataSet(chartData);
    }

    return chartData;
  };

  return (
    <ResponsiveContainer height={500} width="90%">
      <LineChart data={getChartData()}>
        <XAxis
          dataKey="at"
          tickFormatter={formatXAxis}
          interval={250}
          padding={{ left: 30, right: 30 }}
          allowDuplicatedCategory={false}
        />
        {
          graphMeasurements?.map((graph) => (
            <YAxis
              interval="preserveStart"
              key={`yAxis-${graph.metric}`}
              yAxisId={graph.metric}
              label={{
                value: graph.measurements[0].unit,
                position: 'insideLeft',
                angle: -90,
              }}
              allowDuplicatedCategory={false}
            />
          ))
        }
        {
          selectedMetrics.map((metric) => (
            <Line
              key={`line-${metric.metricName}`}
              yAxisId={metric.metricName}
              type="monotone"
              dataKey={metric.metricName}
              stroke={`#${metric.stroke}`}
              dot={false}
            />
          ))
        }
        <CartesianGrid strokeDasharray="3 3" />
        <Tooltip />
        <Legend />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default () => (
  <ApolloProvider client={client}>
    <MetricGraph />
  </ApolloProvider>
);
