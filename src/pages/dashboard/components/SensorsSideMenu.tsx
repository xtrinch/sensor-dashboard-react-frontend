import {
  createStyles,
  Divider,
  Fab,
  Grid,
  List,
  ListItem,
} from "@material-ui/core";
import PlusIcon from "@material-ui/icons/Add";
import { withStyles, WithStyles } from "@material-ui/styles";
import Link from "components/Link";
import SideMenuItem from "components/SideMenuItem";
import { AccountContext } from "context/AccountContext";
import { drawerToggle } from "context/AppContext";
import { DisplayContext } from "context/DisplayContext";
import { ForwarderContext } from "context/ForwarderContext";
import { SensorContext } from "context/SensorContext";
import React, { useContext } from "react";
import { RouteComponentProps, withRouter } from "react-router-dom";
import ColorsEnum from "types/ColorsEnum";
import Sensor from "types/Sensor";
import { Routes } from "utils/Routes";

const styles = () =>
  createStyles({
    subheader: {
      textTransform: "none",
      fontSize: "12px",
      backgroundColor: ColorsEnum.BGLIGHT,
      lineHeight: "19px",
      textAlign: "right",
    },
    listTitle: {
      textTransform: "uppercase",
      padding: "5px 16px",
      minHeight: "40px",
      // borderTop: `1px solid ${ColorsEnum.GRAYDARK}`,
      backgroundColor: ColorsEnum.BGLIGHTER,
      color: "white",
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
      color: ColorsEnum.BLUE,
      backgroundColor: "transparent",
      "& .MuiSvgIcon-root": {
        fontSize: "25px!important",
      },
    },
  });

interface SensorsSideMenuProps {}

const SensorsSideMenu: React.FunctionComponent<
  SensorsSideMenuProps & WithStyles<typeof styles> & RouteComponentProps<{}>
> = (props) => {
  const { history } = props;

  const {
    state: { sensors, mySensors },
  } = useContext(SensorContext);
  const {
    state: { displays },
  } = useContext(DisplayContext);
  const {
    state: { forwarders },
  } = useContext(ForwarderContext);
  const {
    state: { loginState, user },
  } = useContext(AccountContext);

  const goToDisplays = () => {
    drawerToggle();
    history.push(Routes.DISPLAY_LIST);
  };

  const goToForwarders = () => {
    drawerToggle();
    history.push(Routes.FORWARDER_LIST);
  };

  const { classes } = props;
  return (
    <>
      {loginState === "LOGGED_IN" && (
        <>
          <Grid container className={classes.listTitle} alignItems="center">
            <Grid item xs>
              My sensors
            </Grid>
            <Grid item>
              <Link to={Routes.ADD_SENSOR} onClick={drawerToggle}>
                <Fab color="primary" size="small" className={classes.sensorFab}>
                  <PlusIcon />
                </Fab>
              </Link>
            </Grid>
          </Grid>
          <Divider />
          <List disablePadding>
            {mySensors.map((sensor: Sensor) => (
              <SideMenuItem
                item={sensor}
                key={sensor.id}
                type="sensor"
                expandable
                visibility
                context={SensorContext}
              />
            ))}
          </List>
          <List disablePadding>
            <ListItem
              button
              className={classes.listTitle}
              alignItems="center"
              onClick={goToForwarders}
            >
              <Grid container alignItems="center" justify="space-between">
                <Grid item>My packet forwarders</Grid>
                <Grid item>
                  <div onClick={(e) => e.stopPropagation()}>
                    <Link to={Routes.ADD_FORWARDER} onClick={drawerToggle}>
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
          <List disablePadding>
            {forwarders.map((forwarder) => (
              <SideMenuItem
                item={forwarder}
                key={forwarder.id}
                type="forwarder"
              />
            ))}
          </List>
          <List disablePadding>
            <ListItem
              button
              className={classes.listTitle}
              alignItems="center"
              onClick={goToDisplays}
            >
              <Grid container alignItems="center" justify="space-between">
                <Grid item>My display devices</Grid>
                <Grid item>
                  <div onClick={(e) => e.stopPropagation()}>
                    <Link to={Routes.ADD_DISPLAY} onClick={drawerToggle}>
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
          <List disablePadding>
            {displays.map((item) => (
              <SideMenuItem item={item} key={item.id} type="display" />
            ))}
          </List>
        </>
      )}
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
            <SideMenuItem
              context={SensorContext}
              item={sensor}
              key={sensor.id}
              type="sensor"
              expandable
              visibility
            />
          ))}
      </List>
    </>
  );
};

export default withStyles(styles)(withRouter(SensorsSideMenu));
