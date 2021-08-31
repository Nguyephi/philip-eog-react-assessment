import React from 'react';
import Typography from '@material-ui/core/Typography';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Box from '@material-ui/core/Box';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import useMediaQuery from '@material-ui/core/useMediaQuery';

import Weather from '../Features/Weather/Weather';

const useStyles = makeStyles({
  grow: {
    flexGrow: 1,
    width: 350,
  },
});

export default () => {
  const classes = useStyles();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const name = "Philip's";
  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" color="inherit" className={classes.grow} noWrap>
            {name} EOG React Visualization Assessment
          </Typography>
          {
            !isMobile
            && <Weather />
          }
        </Toolbar>
      </AppBar>
      {
        isMobile
        && (
          <Box mt={1} ml="auto" mr="auto" width={300}>
            <Weather />
          </Box>
        )
      }
    </>
  );
};
