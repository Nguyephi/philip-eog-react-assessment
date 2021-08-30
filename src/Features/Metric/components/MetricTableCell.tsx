import React, { FC } from 'react';
import {
  useQuery,
  gql,
} from '@apollo/client';
// import LinearProgress from '@material-ui/core/LinearProgress';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';

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

type MetricTableCellData = {
  metric: string;
  at: number;
  value: number;
  unit: string;
};
type MetricTableCellResponse = {
  getLastKnownMeasurement: MetricTableCellData;
};

interface SelectedMetric {
  metric: string;
}

const MetricTableCell: FC<SelectedMetric> = ({ metric }: SelectedMetric) => {
  // const classes = useStyles();
  const { data } = useQuery<MetricTableCellResponse>(query, {
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
