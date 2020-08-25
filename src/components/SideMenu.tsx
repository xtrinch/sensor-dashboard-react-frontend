import {
  createStyles,
  Divider,
  Fab,
  Grid,
  List,
  ListSubheader,
} from "@material-ui/core";
import PlusIcon from "@material-ui/icons/Add";
import { withStyles, WithStyles } from "@material-ui/styles";
import Logo from "assets/transistor.svg"; // with import
import Link from "components/Link";
import SensorItem from "components/SensorItem";
import { AccountContext } from "context/AccountContext";
import { ConfirmationContext } from "context/ConfirmationContext";
import { SensorContext } from "context/SensorContext";
import React, { useContext } from "react";
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
      color: "white",
    },
  });

interface SideMenuProps {}

const SideMenu: React.FunctionComponent<
  SideMenuProps & WithStyles<typeof styles>
> = (props) => {
  const [{ sensors }] = useContext(SensorContext);
  const [{ loginState, user, logout }, dispatchAccount] = useContext(
    AccountContext
  );
  const [confirmationContext, dispatchConfirmationContext] = useContext(
    ConfirmationContext
  );

  const logoutWithConfirmation = () => {
    const onConfirm = () => logout(dispatchAccount);
    confirmationContext.openModal(
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
        {sensors
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

export default withStyles(styles)(SideMenu);
