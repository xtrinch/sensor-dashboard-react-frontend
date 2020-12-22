import { Card, createStyles, Typography } from "@material-ui/core";
import { withStyles, WithStyles } from "@material-ui/styles";
import NivoChart from "components/NivoChart";
import { SensorContext } from "context/SensorContext";
import { uniqBy } from "lodash";
import React, { useContext } from "react";
import ColorsEnum from "types/ColorsEnum";
import DomainTypeEnum from "types/DomainTypeEnum";
import Measurement from "types/Measurement";
import MeasurementTypeEnum, {
  MeasurementTypeLabelsEnum,
} from "types/MeasurementTypeEnum";
import Sensor from "types/Sensor";
import { DateRange, DateRangeEnum, DateRegex } from "utils/date.range";

const styles = () =>
  createStyles({
    root: {
      borderBottom: `1px solid ${ColorsEnum.BGLIGHTER}`,
      boxShadow: "none",
      borderRadius: "0px",
      backgroundColor: ColorsEnum.BGDARK,
      padding: "15px",
      "& svg": {
        overflow: "visible",
      },
      "&:nth-of-type(2n + 1)": {
        borderRight: `1px solid ${ColorsEnum.BGLIGHTER}`,
      },
    },
    picker: {
      marginRight: "10px",
      marginBottom: "10px",
      width: "170px",
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
  type: MeasurementTypeEnum;
  date: DateRegex;
  groupBy: DateRangeEnum;
  measurements: Measurement[];
  domain: DomainTypeEnum;
}

const SensorCanvas: React.FunctionComponent<
  SensorCanvasProps & WithStyles<typeof styles>
> = (props) => {
  const { type, classes, date, groupBy, measurements, domain } = props;
  const [{ sensors, mySensors }] = useContext(SensorContext);
  const allSensors = uniqBy([...sensors, ...mySensors], (s: Sensor) => s.id);

  const groupByProperties = {
    [DateRangeEnum.hour]: {
      unit: "",
      tickFormat: "%M",
      format: "%Y/%m/%d %H:%M",
    },
    [DateRangeEnum.day]: {
      unit: "h",
      tickFormat: "%H",
      format: "%Y/%m/%d %H:%M",
    },
    [DateRangeEnum.week]: {
      unit: "",
      tickFormat: "%a",
      format: "%Y/%m/%d %H",
    },
    [DateRangeEnum.month]: {
      unit: ".",
      tickFormat: "%d",
      format: "%Y/%m/%d",
    },
    [DateRangeEnum.year]: {
      unit: "",
      tickFormat: "%b",
      format: "%Y/%m/%d",
    },
  };

  return (
    <>
      <Card className={classes.root}>
        <Typography variant="h6" style={{ marginBottom: "7px" }}>
          {MeasurementTypeLabelsEnum[type]}
        </Typography>
        <div style={{ height: "90%" }}>
          {measurements && (
            <NivoChart
              data={Object.keys(measurements).map((key) => ({
                data: measurements[key].map((m: Measurement) => ({
                  y: m.measurement,
                  x: m.createdAt,
                })),
                id: allSensors.find((s) => s.id === parseInt(key, 10))?.name,
                label: allSensors.find((s) => s.id === parseInt(key, 10))?.name,
                ordering: allSensors
                  .filter((s) => s.visible)
                  .findIndex((s) => s.id === parseInt(key, 10)),
              }))}
              from={DateRange.format(DateRange.parse(date).from, groupBy)}
              to={DateRange.format(DateRange.parse(date).to, groupBy)}
              xFormat={groupByProperties[groupBy].format}
              tickFormat={groupByProperties[groupBy].tickFormat}
              domain={
                domain === DomainTypeEnum.FULL
                  ? (Sensor.measurementTypeProperties[type].domain as [
                      number,
                      number
                    ])
                  : ([undefined, undefined] as [number, number])
              }
              unit={{
                y: Sensor.measurementTypeProperties[type].unit,
                x: groupByProperties[groupBy].unit,
              }}
            />
          )}
        </div>
      </Card>
    </>
  );
};

export default withStyles(styles)(SensorCanvas);
