import {
  Collapse,
  createStyles,
  Divider,
  Fab,
  Grid,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListSubheader,
} from "@material-ui/core";
import PlusIcon from "@material-ui/icons/Add";
import ExpandLessIcon from "@material-ui/icons/ExpandLess";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import SettingsIcon from "@material-ui/icons/Settings";
import VisibilityIcon from "@material-ui/icons/Visibility";
import VisibilityOffIcon from "@material-ui/icons/VisibilityOff";
import { withStyles, WithStyles } from "@material-ui/styles";
import Logo from "assets/transistor.svg"; // with import
import Link from "components/Link";
import { AccountContext } from "context/AccountContext";
import { ConfirmationContext } from "context/ConfirmationContext";
import { SensorContext } from "context/SensorContext";
import { differenceInMinutes } from "date-fns";
import React, { Fragment, useContext } from "react";
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
      alignItems: "center",
      padding: "0px 16px 10px 16px",
    },
    sensorInputForm: {
      margin: "30px 10px",
      display: "flex",
      flexDirection: "column",
      "& >div": {
        marginBottom: "10px",
      },
      "& .MuiFormHelperText-contained": {
        marginLeft: "0px",
        marginRight: "0px",
      },
    },
    inputFabLower: {
      display: "flex",
      flexDirection: "row",
    },
    fab: {
      marginLeft: "20px",
    },
    logoContainer: {
      //height: "80px",
      //width: "80px",
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
      maxHeight: "30px",
      color: "white",
      marginLeft: "10px",
    },
    userContainer: {
      padding: "15px",
      display: "flex",
      flexDirection: "row",
      alignItems: "flex-start",
      justifyContent: "space-between",
    },
    active: {
      position: "relative",
      "&::before": {
        borderLeft: `15px solid transparent`,
        borderRight: `15px solid  ${ColorsEnum.OLIVE}`,
        borderTop: "15px solid transparent",
        height: 0,
        width: 0,
        position: "absolute",
        right: "0px",
        bottom: 0,
        zIndex: 2,
        content: '""',
        display: "block",
      },
    },
  });

interface SideMenuProps {}

const SideMenu: React.FunctionComponent<
  SideMenuProps & WithStyles<typeof styles>
> = (props) => {
  const [{ sensors }, dispatch] = useContext(SensorContext);
  const [{ loginState, user, logout }, dispatchAccount] = useContext(
    AccountContext
  );
  const [confirmationContext, dispatchConfirmationContext] = useContext(
    ConfirmationContext
  );

  const toggleVisibility = async (e: any, sensor: Sensor) => {
    e.stopPropagation();
    sensor.visible = !sensor.visible;
    if (!sensor.visible) {
      sensor.expanded = false;
    }
    dispatch({
      type: "updateSensor",
      payload: sensor,
    });
  };

  const toggleExpand = async (e: any, sensor: Sensor) => {
    e.stopPropagation();
    sensor.expanded = !sensor.expanded;
    dispatch({
      type: "updateSensor",
      payload: sensor,
    });
  };

  const logoutWithConfirmation = () => {
    const onConfirm = () => logout(dispatchAccount);
    confirmationContext.openModal(
      dispatchConfirmationContext,
      "test",
      onConfirm,
      null,
      "Are you sure you want to logout?"
    );
  };
  const { classes } = props;

  return (
    <div className={classes.root}>
      {/* <div className={classes.logoContainer}>
        <img alt="logo" src="/logo.svg" />
      </div>
      <form className={classes.sensorInputForm} onSubmit={addSensor}>
        <TextField
          id="outlined-basic"
          label="Sensor address"
          variant="outlined"
          value={sensorToAdd.address}
          onChange={(e) => (sensorToAdd.address = e.target.value)}
          error={!!validationErrors.address}
          helperText={validationErrors.address?.message}
        />
        <FormControl variant="outlined" error={!!validationErrors.type}>
          <InputLabel>Type</InputLabel>
          <Select
            value={sensorToAdd.type || ""}
            onChange={(e) =>
              (sensorToAdd.type = e.target.value as SensorTypesEnum)
            }
          >
            {Object.values(SensorTypesEnum).map((st, index) => (
              <MenuItem value={st} key={index}>
                {st}
              </MenuItem>
            ))}
          </Select>
          <FormHelperText>
            {validationErrors.type?.message}
          </FormHelperText>
        </FormControl>
        <div className={classes.inputFabLower}>
          <TextField
            style={{ width: "calc(100% - 75px)" }}
            id="outlined-basic"
            label="Sensor name"
            variant="outlined"
            value={sensorToAdd.name}
            onChange={(e) => (sensorToAdd.name = e.target.value)}
            error={!!validationErrors.name}
            helperText={validationErrors.name?.message}
          />
          <Fab type="submit" color="primary" className={classes.fab}>
            <AddIcon />
          </Fab>
        </div>
      </form> */}
      <ListSubheader disableGutters className={classes.subheader}>
        <div className={classes.userContainer}>
          <div className={classes.logoContainer}>
            <Link to="/">
              <img alt="logo" src={Logo} />
            </Link>
          </div>
          {(loginState === "LOGGED_OUT" || loginState === "LOGIN_ERROR") && (
            <div>
              <Link to="/login">Login</Link> &nbsp; | &nbsp;
              <Link to="/register">Register</Link>
            </div>
          )}
          {loginState === "LOGGED_IN" && (
            <div>
              <div>Logged in as {user.username}</div>
              <Link onClick={() => logoutWithConfirmation()}>Logout</Link>
            </div>
          )}
        </div>
      </ListSubheader>
      <Grid container className={classes.listTitle}>
        <Grid item xs>
          Added sensors
        </Grid>
        {loginState === "LOGGED_IN" && (
          <Grid item>
            <Link to="/add-sensor">
              <Fab
                color="primary"
                size="small"
                className={classes.sensorFab}
                onClick={(e) => {}}
              >
                <PlusIcon />
              </Fab>
            </Link>
          </Grid>
        )}
      </Grid>
      <Divider />
      <List disablePadding>
        {sensors.map((sensor: Sensor & { expanded: boolean }, index) => (
          <Fragment key={index}>
            <ListItem
              divider
              button
              onClick={(e) => {
                toggleExpand(e, sensor);
              }}
              className={
                differenceInMinutes(sensor.lastSeenAt, new Date()) > -60
                  ? classes.active
                  : undefined
              }
            >
              <ListItemIcon>
                {sensor.expanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
              </ListItemIcon>
              <ListItemText>
                {sensor.name}, {sensor.location}
                <br />({sensor.user?.username})
              </ListItemText>
              {sensor.user?.username === user?.username && (
                <div onClick={(e) => e.stopPropagation()}>
                  <Link to={`/sensor/${sensor.id}`}>
                    <Fab
                      color="secondary"
                      size="small"
                      className={classes.sensorFab}
                    >
                      <SettingsIcon />
                    </Fab>
                  </Link>
                </div>
              )}
              <Fab
                color="secondary"
                size="small"
                className={classes.sensorFab}
                onClick={(e) => {
                  toggleVisibility(e, sensor);
                }}
              >
                {sensor.visible ? <VisibilityIcon /> : <VisibilityOffIcon />}
              </Fab>
              {/* <Fab
                color="secondary"
                size="small"
                className={classes.sensorFab}
                onClick={() => removeSensor(sensor)}
              >
                <RemoveIcon />
              </Fab> */}
            </ListItem>
            <Collapse in={sensor.expanded} timeout="auto" unmountOnExit>
              <List component="div" disablePadding>
                {sensor.measurementTypes.map((m, index) => (
                  <ListItem button key={index}>
                    <ListItemText primary={`${m}`} />
                  </ListItem>
                ))}
              </List>
            </Collapse>
          </Fragment>
        ))}
      </List>
    </div>
  );
};

export default withStyles(styles)(SideMenu);
