import React, { FC } from 'react';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import { makeStyles } from '@material-ui/core/styles';

import MetricTableCell from './MetricTableCell';
import { useAppSelector } from '../selectors';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingLeft: theme.spacing(4),
    paddingRight: theme.spacing(4),
    marginLeft: 'auto',
    marginRight: 'auto',
    marginBottom: theme.spacing(5),
    width: '80%',
  },
}));

const MetricTable: FC = () => {
  const classes = useStyles();
  const selectedMetrics = useAppSelector(state => state.metrics.metrics);
  if (!selectedMetrics.length) {
    return null;
  }
  return (
    <TableContainer component={Paper} className={classes.root}>
      <Table aria-label="metricTable">
        <TableHead>
          <TableRow>
            <TableCell>Metric</TableCell>
            <TableCell align="right">Value</TableCell>
            <TableCell align="right">Unit</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {
            selectedMetrics.length > 0 && selectedMetrics.map(({ metricName }) => (
              <MetricTableCell key={metricName} metric={metricName} />
            ))
          }
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default MetricTable;
