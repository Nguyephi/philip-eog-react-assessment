import React from 'react';
import Grid from '@material-ui/core/Grid';

import MetricSelectInput from './components/MetricSelectInput';
import MetricTable from './components/MetricTable';
import MetricGraph from './components/MetricGraph';

const EogAssessment = () => (
  <Grid container>
    <Grid item xs={12}>
      <MetricSelectInput />
    </Grid>
    <Grid item xs={12}>
      <MetricTable />
    </Grid>
    <Grid item xs={12}>
      <MetricGraph />
    </Grid>
  </Grid>
);

export default EogAssessment;
