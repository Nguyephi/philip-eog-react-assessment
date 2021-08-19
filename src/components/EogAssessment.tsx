import React from 'react';
import Grid from '@material-ui/core/Grid';

import MetricSelectInput from '../Features/Metric/MetricSelectInput';
import RenderMetricCards from '../Features/Metric/RenderMetricCards';

const EogAssessment = () => (
  <Grid container>
    <Grid item xs={12}>
      <MetricSelectInput />
    </Grid>
    <Grid item xs={12}>
      <RenderMetricCards />
    </Grid>
  </Grid>
);

export default EogAssessment;
