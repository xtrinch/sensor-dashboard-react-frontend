import { WithStyles } from '@mui/styles';
import createStyles from '@mui/styles/createStyles';
import withStyles from '@mui/styles/withStyles';
import React from 'react';

const styles = (theme) => createStyles({});

const Wrapper: React.FunctionComponent<WithStyles<typeof styles>> = (props) => {
  return <>{props.children}</>;
};

export default withStyles(styles)(Wrapper);
