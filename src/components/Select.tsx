import Select from '@material-ui/core/Select/Select';
import { withStyles, Theme } from '@material-ui/core/styles';

const styles = (theme: Theme) => ({
  root: {
    background: theme.palette.secondary.main,
  },
  label: {
    color: theme.palette.primary.main,
  },
});
export default withStyles(styles)(Select);
