import { createStyles, WithStyles, withStyles } from "@material-ui/core";
import SensorCanvas from "components/SensorCanvas";
import TopMenu from "components/TopMenu";
import { AppContext } from "context/AppContext";
import { SensorContext } from "context/SensorContext";
import React, { useCallback, useContext, useEffect, useState } from "react";
import MeasurementService from "services/MeasurementService";
import ColorsEnum from "types/ColorsEnum";
import MeasurementTypeEnum from "types/MeasurementTypeEnum";
import Sensor from "types/Sensor";

const styles = (theme) =>
  createStyles({
    root: {
      display: "grid",
      gridTemplateColumns: "repeat(1, 1fr)",
      backgroundColor: ColorsEnum.BGDARK,
      gridGap: "5px",
      padding: "5px",
      gridAutoRows: "calc(50vh - 40px)",
      width: "100%",
      boxSizing: "border-box",
      overflow: "auto",
      [theme.breakpoints.up("md")]: {
        gridTemplateColumns: "repeat(2, 1fr)",
      },
    },
  });

const SensorsPage: React.FunctionComponent<WithStyles<typeof styles>> = (
  props
) => {
  const { classes } = props;

  const [{ sensors }] = useContext(SensorContext);
  const [{ date, groupBy }] = useContext(AppContext);

  const [measurements, setMeasurements] = useState(null);

  const getMeasurements = useCallback(async () => {
    const resp = await MeasurementService.listMeasurements({
      createdAtRange: date,
      measurementTypes: sensors.reduce((acc, sensor: Sensor) => {
        return [...acc, ...sensor.measurementTypes];
      }, []),
      sensorIds: sensors.filter((s) => s.visible).map((s) => s.id),
    });
    setMeasurements(resp);
  }, [date, sensors]);

  useEffect(() => {
    if (!date || sensors.length === 0) {
      return;
    }

    getMeasurements();
  }, [date, getMeasurements, sensors]);

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
      <TopMenu />
      {measurements && (
        <div className={classes.root}>
          {sensorTypes().map((type: MeasurementTypeEnum) => (
            <SensorCanvas
              key={type}
              type={type}
              date={date}
              groupBy={groupBy}
              measurements={measurements[type] || []}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default withStyles(styles)(SensorsPage);
