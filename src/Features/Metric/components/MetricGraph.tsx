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
import { useQuery } from '@apollo/client';

import { useAppSelector, useAppDispatch } from '../../../utils/reduxSelectors';
import { setGraphData } from '../reducer';
import { metricGraphQuery, metricGraphSubscription } from '../queries';
import { MetricGraphResponse, MetricGraphData } from '../types';
import { getGraphData } from '../selectors';

const MetricGraph: FC = () => {
  const dispatch = useAppDispatch();
  const metricState = useAppSelector(state => state.metrics);
  const { metrics: selectedMetrics, metricQuery, graphData } = metricState;

  const { subscribeToMore, data } = useQuery<MetricGraphResponse>(metricGraphQuery, {
    variables: { input: [...metricQuery] },
    // fetchPolicy: 'no-cache',
  });
  // Toast errors
  // if (loading) return <LinearProgress />;
  // if (error) return <Typography color="error">{error}</Typography>;
  if (!data || !selectedMetrics.length) return null;

  const { getMultipleMeasurements: graphMeasurements } = data;

  // const handleFirstDataSet = () => {
  //   const chartData: any[] = [];
  //   graphMeasurements[0].measurements.forEach((m) => {
  //     chartData.push({
  //       at: m.at,
  //       [m.metric]: m.value,
  //     });
  //   });
  //   return chartData;
  // };

  // const handleMultiDataSet = (dataSet: any[]) => {
  //   const chartData = [...dataSet];
  //   selectedMetrics.forEach((metric, idx) => {
  //     if (!Object.prototype.hasOwnProperty.call(graphMeasurements[idx], metric.metricName)) {
  //       graphMeasurements[idx].measurements.forEach((m, mIdx) => {
  //         if (m?.at === chartData[mIdx]?.at) {
  //           chartData[mIdx] = {
  //             [m.metric]: m.value,
  //             ...chartData[mIdx],
  //           };
  //         }
  //       });
  //     }
  //   });
  //   return chartData;
  // };

  // const getChartData = () => {
  //   let chartData: any[] = [];
  //   if (!graphMeasurements || !graphMeasurements.length) {
  //     return [];
  //   }

  //   if (!chartData.length) {
  //     chartData = handleFirstDataSet();
  //   }

  //   if (!loading && selectedMetrics.length > 1
  //     && selectedMetrics.length === graphMeasurements.length) {
  //     chartData = handleMultiDataSet(chartData);
  //   }

  //   return chartData;
  // };

  if (graphMeasurements.every(graph => graph.measurements.length > graphData.length)) {
    console.log('dispatch', graphData);
    dispatch(setGraphData(getGraphData(metricState)));
  }

  if (graphMeasurements.length) {
    subscribeToMore({
      document: metricGraphSubscription,
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

export default MetricGraph;
