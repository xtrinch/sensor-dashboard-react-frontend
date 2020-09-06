import {
  createStyles,
  Divider,
  Fab,
  Grid,
  List,
  ListItem,
  ListSubheader,
} from "@material-ui/core";
import PlusIcon from "@material-ui/icons/Add";
import { withStyles, WithStyles } from "@material-ui/styles";
import Logo from "assets/transistor.svg"; // with import
import Link from "components/Link";
import SensorItem from "components/SensorItem";
import { AccountContext, logout } from "context/AccountContext";
import {
  ConfirmationContext,
  openConfirmation,
} from "context/ConfirmationContext";
import { ErrorContext } from "context/ErrorContext";
import { SensorContext } from "context/SensorContext";
import { ToastContext } from "context/ToastContext";
import React, { useContext } from "react";
import { RouteComponentProps, withRouter } from "react-router-dom";
import ColorsEnum from "types/ColorsEnum";
import Sensor from "types/Sensor";

const styles = () =>
  createStyles({
    root: {
      width: "270px",
      height: "100%",
    },
    subheader: {
      textTransform: "none",
      fontSize: "12px",
      backgroundColor: ColorsEnum.BGLIGHT,
      lineHeight: "19px",
      textAlign: "right",
    },
    listTitle: {
      textTransform: "uppercase",
      padding: "10px 16px",
      minHeight: "50px",
    },
    logoContainer: {
      display: "flex",
      justifyContent: "center",
      width: "40px",
      height: "70px",
      "& img": {
        width: "70px",
      },
    },
    sensorFab: {
      width: "30px",
      height: "30px",
      minHeight: "30px",
      color: ColorsEnum.WHITE,
    },
  });

interface SideMenuProps {}

const SideMenu: React.FunctionComponent<
  SideMenuProps & WithStyles<typeof styles> & RouteComponentProps<{}>
> = (props) => {
  const { history } = props;

  const [{ sensors, mySensors }] = useContext(SensorContext);
  const [{ loginState, user }, dispatchAccount] = useContext(AccountContext);
  const [, dispatchConfirmationContext] = useContext(ConfirmationContext);
  const [, dispatchToast] = useContext(ToastContext);
  const [, dispatchError] = useContext(ErrorContext);
  // todo: put in an App.tsx wrapper
  ErrorContext.dispatch = dispatchError;

  const logoutWithConfirmation = () => {
    const onConfirm = () => logout(dispatchAccount, dispatchToast);
    openConfirmation(
      dispatchConfirmationContext,
      onConfirm,
      null,
      "Are you sure you want to logout?"
    );
  };
  const { classes } = props;

  return (
    <div className={classes.root}>
      <ListSubheader disableGutters className={classes.subheader}>
        <Grid container style={{ padding: "15px" }} justify="space-between">
          <Grid item className={classes.logoContainer}>
            <Link to="/">
              <img alt="logo" src={Logo} />
            </Link>
          </Grid>
          {(loginState === "LOGGED_OUT" || loginState === "LOGIN_ERROR") && (
            <Grid item>
              <Link to="/login">Login</Link> &nbsp; | &nbsp;
              <Link to="/register">Register</Link>
            </Grid>
          )}
          {loginState === "LOGGED_IN" && (
            <Grid item>
              <div>Logged in as {user.username}</div>
              <Link onClick={() => logoutWithConfirmation()}>Logout</Link>
            </Grid>
          )}
        </Grid>
      </ListSubheader>
      {loginState === "LOGGED_IN" && (
        <>
          <List disablePadding>
            <ListItem
              button
              className={classes.listTitle}
              alignItems="center"
              onClick={() => history.push("/displays")}
            >
              <Grid container alignItems="center" justify="space-between">
                <Grid item>My display devices</Grid>
                <Grid item>
                  <div onClick={(e) => e.stopPropagation()}>
                    <Link to={`/add-display`}>
                      <Fab
                        color="primary"
                        size="small"
                        className={classes.sensorFab}
                      >
                        <PlusIcon />
                      </Fab>
                    </Link>
                  </div>
                </Grid>
              </Grid>
            </ListItem>
          </List>
          <Divider />
          <Grid container className={classes.listTitle} alignItems="center">
            <Grid item xs>
              My sensors
            </Grid>
            <Grid item>
              <Link to="/add-sensor">
                <Fab color="primary" size="small" className={classes.sensorFab}>
                  <PlusIcon />
                </Fab>
              </Link>
            </Grid>
          </Grid>
          <Divider />
        </>
      )}
      <List disablePadding>
        {mySensors
          .filter((s) => s.userId === user?.id)
          .map((sensor: Sensor) => (
            <SensorItem sensor={sensor} key={sensor.id} />
          ))}
      </List>
      <Grid container className={classes.listTitle} alignItems="center">
        <Grid item xs>
          All sensors
        </Grid>
      </Grid>
      <Divider />
      <List disablePadding>
        {sensors
          .filter((s) => s.userId !== user?.id)
          .map((sensor: Sensor) => (
            <SensorItem sensor={sensor} key={sensor.id} />
          ))}
      </List>
    </div>
  );
};

export default withStyles(styles)(withRouter(SideMenu));
