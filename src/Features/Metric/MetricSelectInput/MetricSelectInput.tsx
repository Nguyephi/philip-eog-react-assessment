import React, { FC, useState } from 'react';
import {
  ApolloClient,
  ApolloProvider,
  useQuery,
  gql,
  InMemoryCache,
} from '@apollo/client';
import LinearProgress from '@material-ui/core/LinearProgress';
import Typography from '@material-ui/core/Typography';
import Select from '@material-ui/core/Select/Select';
import FormControl from '@material-ui/core/FormControl';
import MenuItem from '@material-ui/core/MenuItem';

import { useAppSelector, useAppDispatch } from '../../../reducers/hooks';
import Chip from '../../../components/Chip';
import { addMetric, deleteMetric } from '../../../reducers/metricReducer';

const client = new ApolloClient({
  uri: 'https://react.eogresources.com/graphql',
  cache: new InMemoryCache(),
});

const query = gql`
  query getMetrics {
    getMetrics
  }
`;

class Metrics {
  metric!: string;
}
type MetricList = {
  getMetrics: Metrics[];
};
type MetricListResponse = {
  getMetrics: MetricList;
};

const MetricSelectInput: FC = () => {
  const dispatch = useAppDispatch();
  const { loading, error, data } = useQuery<MetricListResponse>(query);
  const [open, setOpen] = useState(false);
  const selectedMetrics = useAppSelector((state) => state.metrics.metrics);

  const handleOpen = () => {
    setOpen(!open);
  };

  const handleSelect = (e: { target: { value: any; }; }) => {
    const selectedValues = e.target.value;
    const selectedValue = selectedValues.filter(
      (metric: string) => !selectedMetrics.find(m => m.metricName === metric),
    );
    if (selectedValue.length) {
      dispatch(addMetric(selectedValue[selectedValue.length - 1]));
    }
  };

  const handleDelete = (value: string) => {
    dispatch(deleteMetric(value));
  };

  if (loading) return <LinearProgress />;
  if (error) return <Typography color="error">{error}</Typography>;
  if (!data) return <Select autoWidth native={false} multiple={false} value=''><MenuItem>No Metric</MenuItem></Select>;
  const { getMetrics } = data;
  return (
    <FormControl fullWidth>
      <Select
        MenuProps={{
          anchorOrigin: {
            vertical: 'bottom',
            horizontal: 'left',
          },
          getContentAnchorEl: null,
        }}
        autoWidth={false}
        native={false}
        multiple
        open={open}
        onClick={handleOpen}
        onChange={handleSelect}
        value={selectedMetrics}
        displayEmpty
        renderValue={(metrics) => {
          if (!Array.isArray(metrics) || !metrics.length) {
            return 'Select...';
          }
          return (
            <div>
              {Array.isArray(metrics)
              && metrics.map(({ metricName }) => (
                <Chip
                  key={metricName}
                  label={metricName}
                  onDelete={() => handleDelete(metricName)}
                />
              ))}
            </div>
          );
        }}
      >
        {
          Array.isArray(getMetrics)
          && getMetrics.map((metric: string) => (
            <MenuItem key={metric} value={metric}>
              {metric}
            </MenuItem>
          ))
        }
      </Select>
    </FormControl>
  );
};

export default () => (
  <ApolloProvider client={client}>
    <MetricSelectInput />
  </ApolloProvider>
);
