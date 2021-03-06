import React, { FC, useState } from 'react';
import LinearProgress from '@material-ui/core/LinearProgress';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import Select from '@material-ui/core/Select/Select';
import FormControl from '@material-ui/core/FormControl';
import MenuItem from '@material-ui/core/MenuItem';
import { makeStyles } from '@material-ui/core/styles';
import { useQuery } from '@apollo/client';

import { useAppSelector, useAppDispatch } from '../../../utils/reduxSelectors';
import {
  addMetric,
  deleteMetric,
  setStartTime,
  clearSelectedMetrics,
} from '../reducer';
import { getMetricQuery } from '../queries';
import { MetricListResponse } from '../types';
import Chip from '../../../components/Chip';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    display: 'block',
    marginBottom: theme.spacing(4),
  },
  titleContainer: {
    marginTop: theme.spacing(5),
    textAlign: 'center',
  },
  title: {
    [theme.breakpoints.down('sm')]: {
      fontSize: theme.spacing(6),
    },
  },
  select: {
    marginTop: theme.spacing(2),
    display: 'flex',
    width: '80%',
    margin: 'auto',
  },
  menuSelect: {
    '& .MuiSelect-selectMenu': {
      whiteSpace: 'normal',
    },
  },
  chip: {
    marginRight: theme.spacing(1 / 2),
    marginLeft: theme.spacing(1 / 2),
    marginBottom: theme.spacing(1),
  },
}));

const MetricSelectInput: FC = () => {
  const dispatch = useAppDispatch();
  const classes = useStyles();
  const startTime = useAppSelector(state => state.metrics.startTime);
  const [selectedMetrics, setSelectedMetrics] = useState([]);
  const { loading, error, data } = useQuery<MetricListResponse>(getMetricQuery);
  const [open, setOpen] = useState(false);

  const handleOpen = () => {
    setOpen(!open);
  };

  const handleDelete = (value: string) => {
    dispatch(deleteMetric(value));
    setSelectedMetrics(selectedMetrics.filter(m => m !== value));
  };

  const handleSelect = (e: { target: { value: any; }; }) => {
    const selectedValues = e.target.value;
    const newSelectedValue = selectedValues[selectedValues.length - 1];
    const minutes = 30;
    const currentTime = new Date();
    const after = startTime > 0
      ? startTime
      : new Date(currentTime.getTime() - minutes * 60000).valueOf();
    if (!selectedValues.length || !newSelectedValue.length) {
      dispatch(clearSelectedMetrics());
      setSelectedMetrics([]);
      return;
    }
    if (selectedValues.length < selectedMetrics.length) {
      const deletedValue = selectedMetrics.filter(m => !selectedValues.includes(m));
      handleDelete(deletedValue[0]);
      return;
    }
    dispatch(setStartTime(after));
    dispatch(addMetric({ metricName: newSelectedValue, after }));
    setSelectedMetrics(selectedValues);
  };

  if (loading) return <LinearProgress />;
  if (error) return <Typography color="error">{error}</Typography>;
  if (!data) return <Select autoWidth native={false} multiple={false} value=''><MenuItem>No Metric</MenuItem></Select>;
  const { getMetrics } = data;
  return (
    <Grid container className={classes.root}>
      <Grid item className={classes.titleContainer}>
        <Typography variant="h2" className={classes.title}>
          Metric Measurements
        </Typography>
      </Grid>
      <Grid item className={classes.select}>
        <FormControl fullWidth>
          <Select
            className={classes.menuSelect}
            variant="outlined"
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
            renderValue={(metricsList) => {
              if (!Array.isArray(metricsList) || !metricsList.length) {
                return 'Select...';
              }
              return (
                <div>
                  {metricsList.map((metricName) => (
                    <Chip
                      key={metricName}
                      label={metricName}
                      onDelete={() => handleDelete(metricName)}
                      classes={{
                        root: classes.chip,
                      }}
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
      </Grid>
    </Grid>
  );
};

export default MetricSelectInput;
