import React, { FC } from 'react';
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

import { useAppSelector, useAppDispatch } from '../../../reducers/hooks';
import { setGraphData } from '../../../reducers/metricReducer';

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

const graphQuery = gql`
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

interface GraphDataset {
  [key: string]: number;
  at: number;
}

const MetricGraph: FC = () => {
  const dispatch = useAppDispatch();
  const selectedMetrics = useAppSelector(state => state.metrics.metrics);
  const metricQuery = useAppSelector(state => state.metrics.metricQuery);
  const graphData = useAppSelector(state => state.metrics.graphData);

  const { subscribeToMore, loading, data } = useQuery<MetricGraphResponse>(graphQuery, {
    variables: { input: [...metricQuery] },
    // fetchPolicy: 'no-cache',
  });
  // Toast errors
  // if (loading) return <LinearProgress />;
  // if (error) return <Typography color="error">{error}</Typography>;
  if (!data || !selectedMetrics.length) return null;

  const { getMultipleMeasurements: graphMeasurements } = data;

  const handleFirstDataSet = () => {
    const chartData: any[] = [];
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
    selectedMetrics.forEach((metric, idx) => {
      if (!Object.prototype.hasOwnProperty.call(graphMeasurements[idx], metric.metricName)) {
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

  if (graphMeasurements.every(graph => graph.measurements.length > graphData.length)) {
    const newGraphData: GraphDataset[] = getChartData();
    dispatch(setGraphData(newGraphData));
  }

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

  return (
    <ResponsiveContainer height={500}>
      <LineChart data={graphData}>
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
          graphMeasurements.map((graph, idx) => (
            <Line
              key={`line-${graph.metric}`}
              yAxisId={graph.metric}
              type="monotone"
              dataKey={graph.metric}
              stroke={`#${selectedMetrics[idx].stroke}`}
              dot={false}
              isAnimationActive={false}
            />
          ))
        }
        <CartesianGrid strokeDasharray="3 3" />
        <Tooltip labelFormatter={(value: number) => new Date(value).toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true })} />
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
