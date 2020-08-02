import {
  createStyles,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListSubheader,
  ListItemIcon,
  Fab,
} from "@material-ui/core";
import { withStyles, WithStyles } from "@material-ui/styles";
import React from "react";
import VisibilityIcon from "@material-ui/icons/Visibility";
import VisibilityOffIcon from "@material-ui/icons/VisibilityOff";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import ExpandLessIcon from "@material-ui/icons/ExpandLess";
import { SensorStoreProps } from "stores/SensorStore";
import { observer, inject } from "mobx-react";
import { observable } from "mobx";
import Sensor from "types/Sensor";
import { validateAndTransform, FieldErrors } from "utils/validation";
import { Collapse } from "@material-ui/core";
import { Fragment } from "react";
import ColorsEnum from "types/ColorsEnum";

const styles = () =>
  createStyles({
    root: {
      backgroundColor: ColorsEnum.BGLIGHT,
      borderRight: "1px solid rgb(35,40,44)",
      width: "270px",
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
      backgroundColor: ColorsEnum.RED,
      borderRadius: "10px",
      height: "80px",
      width: "80px",
      marginLeft: "10px",
      marginTop: "20px",
      "& img": {
        height: "80px",
        width: "80px",
      },
    },
    sensorFab: {
      width: "35px",
      height: "35px",
      color: "white",
      marginLeft: "10px",
    },
  });

interface SideMenuProps {}

@inject("sensorStore")
@observer
class SideMenu extends React.Component<
  SideMenuProps & WithStyles<typeof styles> & SensorStoreProps
> {
  @observable
  private validationErrors: FieldErrors = {};

  @observable
  private sensorToAdd: Sensor = new Sensor();

  addSensor = async (e) => {
    e.preventDefault();

    this.validationErrors = await validateAndTransform(this.sensorToAdd);
    if (Object.keys(this.validationErrors).length > 0) {
      return;
    }

    const { sensorStore } = this.props;
    sensorStore.addSensor(this.sensorToAdd);
    this.sensorToAdd = new Sensor();
  };

  removeSensor = async (sensor: Sensor) => {
    const { sensorStore } = this.props;
    sensorStore.removeSensor(sensor);
  };

  toggleVisibility = async (e: any, sensor: Sensor) => {
    e.stopPropagation();

    const { sensorStore } = this.props;
    sensorStore.toggleVisibility(sensor);
  };

  render() {
    const {
      classes,
      sensorStore: { sensors },
    } = this.props;

    return (
      <div className={classes.root}>
        {/* <div className={classes.logoContainer}>
          <img alt="logo" src="/logo.svg" />
        </div>
        <form className={classes.sensorInputForm} onSubmit={this.addSensor}>
          <TextField
            id="outlined-basic"
            label="Sensor address"
            variant="outlined"
            value={this.sensorToAdd.address}
            onChange={(e) => (this.sensorToAdd.address = e.target.value)}
            error={!!this.validationErrors.address}
            helperText={this.validationErrors.address?.message}
          />
          <FormControl variant="outlined" error={!!this.validationErrors.type}>
            <InputLabel>Type</InputLabel>
            <Select
              value={this.sensorToAdd.type || ""}
              onChange={(e) =>
                (this.sensorToAdd.type = e.target.value as SensorTypesEnum)
              }
            >
              {Object.values(SensorTypesEnum).map((st, index) => (
                <MenuItem value={st} key={index}>
                  {st}
                </MenuItem>
              ))}
            </Select>
            <FormHelperText>
              {this.validationErrors.type?.message}
            </FormHelperText>
          </FormControl>
          <div className={classes.inputFabLower}>
            <TextField
              style={{ width: "calc(100% - 75px)" }}
              id="outlined-basic"
              label="Sensor name"
              variant="outlined"
              value={this.sensorToAdd.name}
              onChange={(e) => (this.sensorToAdd.name = e.target.value)}
              error={!!this.validationErrors.name}
              helperText={this.validationErrors.name?.message}
            />
            <Fab type="submit" color="primary" className={classes.fab}>
              <AddIcon />
            </Fab>
          </div>
        </form> */}

        <ListSubheader>Added sensors</ListSubheader>
        <Divider />
        <List disablePadding>
          {sensors.map((sensor: Sensor & { expanded: boolean }, index) => (
            <Fragment key={index}>
              <ListItem
                divider
                button
                onClick={() => (sensor.expanded = !sensor.expanded)}
              >
                <ListItemIcon>
                  {sensor.expanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                </ListItemIcon>
                <ListItemText primary={sensor.name} />
                <Fab
                  color="secondary"
                  size="small"
                  className={classes.sensorFab}
                  onClick={(e) => {
                    this.toggleVisibility(e, sensor);
                  }}
                >
                  {sensor.visible ? <VisibilityIcon /> : <VisibilityOffIcon />}
                </Fab>
                {/* <Fab
                  color="secondary"
                  size="small"
                  className={classes.sensorFab}
                  onClick={() => this.removeSensor(sensor)}
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
  }
}

export default withStyles(styles)(SideMenu);
