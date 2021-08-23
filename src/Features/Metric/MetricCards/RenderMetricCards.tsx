import React, { FC } from 'react';
import Grid from '@material-ui/core/Grid';

import MetricCard from './MetricCard';
import { useAppSelector } from '../../../reducers/hooks';

const RenderMetricsCards: FC = () => {
  const selectedMetrics = useAppSelector(state => state.metrics.metrics);
  return (
    <Grid container>
      {
        selectedMetrics.length > 0 && selectedMetrics.map(({ metricName }) => (
          <Grid item xs={12} key={metricName}>
            <MetricCard metric={metricName} />
          </Grid>
        ))
      }
    </Grid>
  );
};

export default RenderMetricsCards;
