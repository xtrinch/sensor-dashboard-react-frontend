import {
  WithStyles,
  createStyles,
  withStyles,
  Button,
  ButtonGroup,
} from "@material-ui/core";
import React, { useState, useEffect, useCallback } from "react";
import { inject } from "mobx-react";
import { SensorStoreProps } from "stores/SensorStore";
import SensorCanvas from "components/SensorCanvas";
import ColorsEnum from "types/ColorsEnum";
import Sensor from "types/Sensor";
import MeasurementTypeEnum from "types/MeasurementTypeEnum";
import GroupMeasurementByEnum from "types/GroupMeasurementByEnum";
import { DateInput } from "components/DateInput";
import MeasurementService from "services/MeasurementService";

const styles = () =>
  createStyles({
    button: {},
    activeButton: {
      backgroundColor: ColorsEnum.GRAY,
      color: ColorsEnum.BGDARK,
    },
    timePicker: {
      height: "60px",
      backgroundColor: ColorsEnum.BGLIGHT,
      padding: "10px 20px",
      boxSizing: "border-box",
      display: "flex",
      flexDirection: "row",
      //justifyContent: 'space-between',
      borderBottom: "1px solid rgb(35,40,44)",
    },
    root: {
      display: "grid",
      //width: "calc(100% - 270px)",
      gridTemplateColumns: "calc(50% - 5px) calc(50% - 5px)",
      backgroundColor: ColorsEnum.BGDARK,
      gridGap: "5px",
      padding: "5px",
      gridAutoRows: "calc(50vh - 15px)",
      width: "100%",
      boxSizing: "border-box",
      height: "calc(100vh - 60px)",
      overflow: "auto",
    },
    placeholder: {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    },
    picker: {
      marginRight: "10px",
      marginBottom: "10px",
      width: "170px",
    },
  });

const SensorsPage: React.FunctionComponent<
  SensorStoreProps & WithStyles<typeof styles>
> = (props) => {
  const {
    classes,
    sensorStore: { sensors },
  } = props;

  const [groupByState, setGroupByState] = useState(
    GroupMeasurementByEnum.month
  );

  const [date, setDate] = useState(
    `${new Date().getFullYear()}/${new Date().getMonth() + 1}`
  );

  const [measurements, setMeasurements] = useState(null);

  const getMeasurements = useCallback(async () => {
    const resp = await MeasurementService.listMeasurements({
      createdAtRange: date,
      measurementTypes: sensors[0].measurementTypes,
    });
    setMeasurements(resp);
  }, [date, sensors]);

  useEffect(() => {
    getMeasurements();
  }, [date, getMeasurements]);

  useEffect(() => {
    if (groupByState === GroupMeasurementByEnum.day) {
      setDate(
        `${new Date().getFullYear()}/${
          new Date().getMonth() + 1
        }/${new Date().getDate()}`
      );
    }
    getMeasurements();
  }, [groupByState, getMeasurements]);

  if (!measurements) {
    return null;
  }

  return (
    <div style={{ width: "100%" }}>
      <div className={classes.timePicker}>
        <div style={{ marginRight: "70px" }}>
          <DateInput
            groupBy={groupByState}
            date={date}
            onChange={(val) => setDate(val)}
          />
        </div>
        <div>
          <ButtonGroup color="secondary" size="large">
            <Button
              onClick={() => setGroupByState(GroupMeasurementByEnum.day)}
              className={
                groupByState === GroupMeasurementByEnum.day
                  ? classes.activeButton
                  : classes.button
              }
            >
              Day
            </Button>
            {/* <Button
              onClick={() => groupByState = GroupMeasurementByEnum.week}
              className={
                groupByState === GroupMeasurementByEnum.week
                  ? classes.activeButton
                  : classes.button
              }
            >
              Week
            </Button> */}
            <Button
              onClick={() => setGroupByState(GroupMeasurementByEnum.month)}
              className={
                groupByState === GroupMeasurementByEnum.month
                  ? classes.activeButton
                  : classes.button
              }
            >
              Month
            </Button>
            {/* <Button
              onClick={() => groupByState = GroupMeasurementByEnum.year}
              className={
                groupByState === GroupMeasurementByEnum.year
                  ? classes.activeButton
                  : classes.button
              }
            >
              Year
            </Button> */}
          </ButtonGroup>
        </div>
      </div>
      <div className={classes.root}>
        {sensors
          .reduce((acc, sensor: Sensor) => {
            return [
              ...acc,
              ...sensor.measurementTypes.map((m) => ({ type: m, s: sensor })),
            ];
          }, [])
          .map((params: { s: Sensor; type: MeasurementTypeEnum }) => (
            <SensorCanvas
              sensor={params.s}
              key={`${params.s.id}${params.type}`}
              type={params.type}
              date={date}
              groupBy={groupByState}
              measurements={measurements[params.type] || []}
            />
          ))}
        {/* {4 - sensors.length > 0 &&
          new Array(4 - sensors.length).fill(0).map((num, index) => (
            <div key={index} className={classes.placeholder}>
              <Typography variant="h5">
                Sensor {index + 1} placeholder
              </Typography>
            </div>
          ))} */}
      </div>
    </div>
  );
};

export default inject("sensorStore")(withStyles(styles)(SensorsPage));
