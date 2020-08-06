import {
  Button,
  ButtonGroup,
  createStyles,
  WithStyles,
  withStyles,
} from "@material-ui/core";
import { DateInput } from "components/DateInput";
import SensorCanvas from "components/SensorCanvas";
import { SensorContext } from "context/SensorContext";
import React, { useCallback, useContext, useEffect, useState } from "react";
import MeasurementService from "services/MeasurementService";
import ColorsEnum from "types/ColorsEnum";
import GroupMeasurementByEnum from "types/GroupMeasurementByEnum";
import MeasurementTypeEnum from "types/MeasurementTypeEnum";
import Sensor from "types/Sensor";

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
      gridAutoRows: "calc(50vh - 40px)",
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

const SensorsPage: React.FunctionComponent<WithStyles<typeof styles>> = (
  props
) => {
  const { classes } = props;

  const [{ sensors }] = useContext(SensorContext);

  // default view of dashboard
  const [groupByState, setGroupByState] = useState(GroupMeasurementByEnum.day);

  const [date, setDate] = useState(null);

  const [measurements, setMeasurements] = useState(null);

  const getMeasurements = useCallback(async () => {
    const resp = await MeasurementService.listMeasurements({
      createdAtRange: date,
      measurementTypes: sensors.reduce((acc, sensor: Sensor) => {
        return [...acc, ...sensor.measurementTypes];
      }, []),
      sensorIds: sensors.map((s) => s.id),
    });
    setMeasurements(resp);
  }, [date, sensors]);

  useEffect(() => {
    console.log(sensors);
    if (!date || sensors.length === 0) {
      return;
    }

    getMeasurements();
  }, [date, getMeasurements, sensors]);

  const onChange = useCallback((val) => {
    setDate(val);
  }, []);

  const sensorTypes = (): MeasurementTypeEnum[] => {
    // collect all returned measurement types
    let sensorTypes: MeasurementTypeEnum[] = sensors.reduce(
      (acc, sensor: Sensor) => {
        return [...acc, ...sensor.measurementTypes];
      },
      []
    );

    // filter duplicates
    sensorTypes = sensorTypes.filter(
      (item: MeasurementTypeEnum, pos: number) =>
        sensorTypes.findIndex((d: MeasurementTypeEnum) => d === item) === pos
    );

    return sensorTypes;
  };

  return (
    <div style={{ width: "100%" }}>
      <div className={classes.timePicker}>
        <div style={{ marginRight: "70px" }}>
          <DateInput
            groupBy={groupByState}
            date={date}
            onChange={onChange}
            style={{ width: "300px" }}
          />
        </div>
        <div>
          <ButtonGroup color="secondary" size="large">
            {Object.values(GroupMeasurementByEnum).map((val) => (
              <Button
                onClick={() => setGroupByState(val)}
                className={
                  groupByState === val ? classes.activeButton : classes.button
                }
                key={val}
              >
                {val}
              </Button>
            ))}
          </ButtonGroup>
        </div>
      </div>
      {measurements && (
        <div className={classes.root}>
          {sensorTypes().map((type: MeasurementTypeEnum) => (
            <SensorCanvas
              key={type}
              type={type}
              date={date}
              groupBy={groupByState}
              measurements={measurements[type] || []}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default withStyles(styles)(SensorsPage);
