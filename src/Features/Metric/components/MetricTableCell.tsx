import React, { FC } from 'react';
// import LinearProgress from '@material-ui/core/LinearProgress';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import { useQuery } from '@apollo/client';

import { metricSelectQuery } from '../selectors';
import { MetricTableCellResponse, SelectedMetric } from '../types';

const MetricTableCell: FC<SelectedMetric> = ({ metric }: SelectedMetric) => {
  // const classes = useStyles();
  const { data } = useQuery<MetricTableCellResponse>(metricSelectQuery, {
    variables: { metricName: metric },
    pollInterval: 5000,
  });
  // if (loading) return <LinearProgress />;
  // handle error with toast
  // if (error) return <Typography color="error">{error}</Typography>;
  if (!data) return null;
  const { value, unit } = data.getLastKnownMeasurement;

  return (
    <TableRow>
      <TableCell component="th" scope="row">
        {metric}
      </TableCell>
      <TableCell align="right">{value}</TableCell>
      <TableCell align="right">{unit}</TableCell>
    </TableRow>
  );
};

export default MetricTableCell;
