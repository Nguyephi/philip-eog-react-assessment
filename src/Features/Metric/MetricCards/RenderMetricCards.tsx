import React, { FC } from 'react';
import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/core/styles';

import MetricCard from './MetricCard';
import { useAppSelector } from '../../../reducers/hooks';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    justifyContent: 'left',
    paddingLeft: theme.spacing(8),
    paddingRight: theme.spacing(8),
    marginBottom: theme.spacing(5),
  },
  cardContainer: {
    display: 'flex',
    margin: theme.spacing(1),
  },
}));

const RenderMetricsCards: FC = () => {
  const classes = useStyles();
  const selectedMetrics = useAppSelector(state => state.metrics.metrics);
  return (
    <Grid container className={classes.root}>
      {
        selectedMetrics.length > 0 && selectedMetrics.map(({ metricName }) => (
          <Grid item xs={4} md={2} key={metricName} className={classes.cardContainer}>
            <MetricCard metric={metricName} />
          </Grid>
        ))
      }
    </Grid>
  );
};

export default RenderMetricsCards;
