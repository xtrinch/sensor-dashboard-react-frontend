import { WithStyles } from '@mui/styles';
import createStyles from '@mui/styles/createStyles';
import withStyles from '@mui/styles/withStyles';
import GoogleLogo from 'assets/google-logo.svg'; // with import
import config from 'config/Config';
import React, { CSSProperties } from 'react';
import { RouteComponentProps, withRouter } from 'react-router';

const styles = (theme) =>
  createStyles({
    loginWithGoogle: {
      backgroundColor: 'white',
      color: 'black',
      padding: '7px 10px',
      borderRadius: '5px',
      minHeight: '40px',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      textDecoration: 'none',
    },
  });

const LoginWithGoogle: React.FunctionComponent<
  WithStyles<typeof styles> & RouteComponentProps<{}> & { text?: string; style?: CSSProperties }
> = (props) => {
  const { classes } = props;

  return (
    <div style={props.style}>
      <a href={`${config.sensorDashboardUrl}/google/redirect`} className={classes.loginWithGoogle}>
        <img src={GoogleLogo} alt="google-logo" style={{ marginRight: '10px' }} />
        {props.text || 'Login with Google'}
      </a>
    </div>
  );
};

export default withRouter(withStyles(styles)(LoginWithGoogle));
