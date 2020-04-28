import {
  WithStyles,
  createStyles,
  withStyles,
  Typography,
} from "@material-ui/core";
import React from "react";
import { inject, observer } from "mobx-react";
import { SensorStoreProps } from "stores/SensorStore";
import SensorCanvas from "components/SensorCanvas";
import ColorsEnum from "types/ColorsEnum";
import Sensor from "types/Sensor";

const styles = () =>
  createStyles({
    root: {
      display: "grid",
      width: "calc(100% - 330px)",
      gridTemplateColumns: "calc(50% - 5px) calc(50% - 5px)",
      backgroundColor: ColorsEnum.BGDARK,
      gridGap: "10px",
      padding: "10px",
      gridAutoRows: "calc(50vh - 15px)",
    },
    placeholder: {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    },
  });

@inject("sensorStore")
@observer
class SensorsPage extends React.Component<
  WithStyles<typeof styles> & SensorStoreProps
> {
  render() {
    const {
      classes,
      sensorStore: { sensors },
    } = this.props;

    return (
      <div className={classes.root}>
        {sensors.map((s: Sensor) => (
          <SensorCanvas sensor={s} key={s.id} />
        ))}
        {new Array(4 - sensors.length).fill(0).map((num, index) => (
          <div key={index} className={classes.placeholder}>
            <Typography variant="h5">Sensor {index + 1} placeholder</Typography>
          </div>
        ))}
      </div>
    );
  }
}

export default withStyles(styles)(SensorsPage);
