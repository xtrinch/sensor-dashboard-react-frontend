import { Grid, ListSubheader } from '@mui/material';
import createStyles from '@mui/styles/createStyles';
import { withStyles, WithStyles } from '@mui/styles';
import Logo from 'assets/transistor.svg'; // with import
import Link from 'components/Link';
import MainMenu from 'components/MainMenu';
import { AccountContext } from 'context/AccountContext';
import { AppContext } from 'context/AppContext';
import { getUserRoute } from 'pages/users/UserRoutes';
import React, { useContext } from 'react';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import ColorsEnum from 'types/ColorsEnum';
import { Routes } from 'utils/Routes';
import { observer } from 'mobx-react-lite';
import { ConfirmationContext } from 'context/ConfirmationContext';

const styles = () =>
  createStyles({
    root: {
      width: '270px',
      height: '100%',
    },
    subheader: {
      textTransform: 'none',
      fontSize: '12px',
      backgroundColor: ColorsEnum.BGLIGHT,
      lineHeight: '19px',
      textAlign: 'right',
    },
    listTitle: {
      padding: '5px 16px',
      minHeight: '40px',
      backgroundColor: ColorsEnum.BGLIGHTER,
      color: 'white',
    },
    logoContainer: {
      display: 'flex',
      justifyContent: 'center',
      width: '40px',
      height: '70px',
      '& img': {
        width: '70px',
      },
    },
    sensorFab: {
      width: '30px',
      height: '30px',
      minHeight: '30px',
      color: ColorsEnum.BLUE,
      backgroundColor: 'transparent',
      '& .MuiSvgIcon-root': {
        fontSize: '25px!important',
      },
    },
  });

interface SideMenuProps {}

const SideMenu: React.FunctionComponent<
  SideMenuProps & WithStyles<typeof styles> & RouteComponentProps<{}>
> = (props) => {
  const { history } = props;
  const { logout, loginState, user } = useContext(AccountContext);
  const appContext = useContext(AppContext);
  const confirmationContext = useContext(ConfirmationContext);

  const logoutWithConfirmation = () => {
    const onConfirm = async () => {
      await logout();
      appContext.drawerToggle();
      history.push('/');
    };
    confirmationContext.openConfirmation(onConfirm, null, 'Are you sure you want to logout?');
  };

  const { classes } = props;
  return (
    <div className={classes.root}>
      <ListSubheader disableGutters className={classes.subheader}>
        <Grid container style={{ padding: '15px' }} justifyContent="space-between">
          <Grid item className={classes.logoContainer}>
            <Link to="/" onClick={appContext.drawerToggle}>
              <img alt="logo" src={Logo} />
            </Link>
          </Grid>
          {(loginState === 'LOGGED_OUT' || loginState === 'LOGIN_ERROR') && (
            <Grid item>
              <Link to={Routes.LOGIN} onClick={appContext.drawerToggle}>
                Login
              </Link>{' '}
              &nbsp; | &nbsp;
              <Link to={Routes.REGISTER} onClick={appContext.drawerToggle}>
                Register
              </Link>
            </Grid>
          )}
          {loginState === 'LOGGED_IN' && (
            <Grid item>
              <div>
                Logged in as{' '}
                <Link to={getUserRoute(user?.id)} color={ColorsEnum.YELLOW}>
                  {user?.username}
                </Link>
              </div>
              <Link onClick={() => logoutWithConfirmation()}>Logout</Link>
            </Grid>
          )}
        </Grid>
        <MainMenu />
      </ListSubheader>
    </div>
  );
};

export default withStyles(styles)(withRouter(observer(SideMenu)));
