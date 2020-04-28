import { createStyles, Card, Typography } from "@material-ui/core";
import { withStyles, WithStyles } from "@material-ui/styles";
import React from "react";
import { observer, Provider } from "mobx-react";
import ArkStore, { ArkStoreProps } from "stores/ArkStore";
import ColorsEnum from "types/ColorsEnum";
import { Chart } from "./Chart";
import {
  KeyboardDatePicker,
  MuiPickersUtilsProvider,
} from "@material-ui/pickers";
import DateFnsUtils from "@date-io/date-fns";
import Sensor from "types/Sensor";
import { observable } from "mobx";

const styles = () =>
  createStyles({
    root: {
      //border: '1px solid #000',
      backgroundColor: ColorsEnum.BGLIGHT,
      padding: "10px",
    },
    picker: {
      marginRight: "10px",
      marginBottom: "10px",
      width: "170px",
    },
    chart: {
      height: "calc(50vh - 140px)",
    },
    noResults: {
      width: "100%",
      height: "calc(100% - 110px)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    },
  });

interface SensorCanvasProps {
  sensor: Sensor;
}

@observer
class SensorCanvas extends React.Component<
  SensorCanvasProps & WithStyles<typeof styles> & ArkStoreProps
> {
  @observable
  private arkStore: ArkStore;

  constructor(props) {
    super(props);
    this.arkStore = new ArkStore(props.sensor);
  }

  render() {
    const { classes } = this.props;

    const {
      arkStore: {
        sensor,
        changeFromDate,
        changeToDate,
        fromDate,
        toDate,
        measurements,
      },
    } = this;

    if (!sensor.visible) {
      return null;
    }

    return (
      <Provider arkStore={this.arkStore}>
        <Card className={classes.root}>
          <Typography variant="h6" style={{ marginBottom: "15px" }}>
            {sensor.name} ({sensor.address})
          </Typography>
          <div>
            <MuiPickersUtilsProvider utils={DateFnsUtils}>
              <KeyboardDatePicker
                clearable
                className={classes.picker}
                value={fromDate}
                onChange={(date) => changeFromDate(date)}
                format="MM/dd/yyyy"
                inputVariant="outlined"
                label="From"
              />
            </MuiPickersUtilsProvider>
            <MuiPickersUtilsProvider utils={DateFnsUtils}>
              <KeyboardDatePicker
                clearable
                className={classes.picker}
                value={toDate}
                onChange={(date) => changeToDate(date)}
                format="MM/dd/yyyy"
                inputVariant="outlined"
                label="To"
              />
            </MuiPickersUtilsProvider>
          </div>
          {measurements.length ? (
            <Chart
              className={classes.chart}
              chartType="line"
              graphData={[
                ...measurements.map((m) => ({
                  x: m.date,
                  y: m.value,
                })),
              ]}
              domain={{
                xMin: fromDate,
                xMax: toDate,
              }}
            />
          ) : (
            <div className={classes.noResults}>
              <Typography variant="h5" style={{ marginBottom: "15px" }}>
                No results
              </Typography>
            </div>
          )}
        </Card>
      </Provider>
    );
  }
}

export default withStyles(styles)(SensorCanvas);
