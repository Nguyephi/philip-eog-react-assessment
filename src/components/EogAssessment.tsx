import React from 'react';
import Grid from '@material-ui/core/Grid';

import MetricSelectInput from '../Features/Metric/MetricSelectInput/MetricSelectInput';
import RenderMetricCards from '../Features/Metric/MetricCards/RenderMetricCards';
import MetricGraph from '../Features/Metric/MetricGraph/MetricGraph';

const EogAssessment = () => (
  <Grid container>
    <Grid item xs={12}>
      <MetricSelectInput />
    </Grid>
    <Grid item xs={12}>
      <RenderMetricCards />
    </Grid>
    <Grid item xs={12}>
      <MetricGraph />
    </Grid>
  </Grid>
);

export default EogAssessment;
