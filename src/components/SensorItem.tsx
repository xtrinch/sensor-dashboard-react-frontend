import {
  Collapse,
  createStyles,
  Fab,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  withStyles,
  WithStyles,
} from "@material-ui/core";
import ExpandLessIcon from "@material-ui/icons/ExpandLess";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import SettingsIcon from "@material-ui/icons/Settings";
import VisibilityIcon from "@material-ui/icons/Visibility";
import VisibilityOffIcon from "@material-ui/icons/VisibilityOff";
import Link from "components/Link";
import { AccountContext } from "context/AccountContext";
import { drawerToggle } from "context/AppContext";
import { SensorContext } from "context/SensorContext";
import { differenceInMinutes } from "date-fns";
import React, { Fragment, useContext } from "react";
import ColorsEnum from "types/ColorsEnum";
import Sensor from "types/Sensor";

interface SensorItemProps {
  sensor: Sensor;
}

const styles = () =>
  createStyles({
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
    sensorFab: {
      width: "30px",
      height: "30px",
      minHeight: "30px",
      maxHeight: "30px",
      color: "white",
      marginLeft: "10px",
    },
  });

const SensorItem: React.FunctionComponent<
  SensorItemProps & WithStyles<typeof styles>
> = (props) => {
  const { sensor, classes } = props;

  const [{ user }] = useContext(AccountContext);
  const [, dispatch] = useContext(SensorContext);

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

  return (
    <Fragment>
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
            <Link to={`/sensors/${sensor.id}`} onClick={drawerToggle}>
              <Fab color="secondary" size="small" className={classes.sensorFab}>
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
  );
};

SensorItem.defaultProps = {};

export default withStyles(styles)(SensorItem);
