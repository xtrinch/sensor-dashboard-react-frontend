import { createStyles, Card, Typography } from "@material-ui/core";
import { withStyles, WithStyles } from "@material-ui/styles";
import React from "react";
import { observer } from "mobx-react";
import ColorsEnum from "types/ColorsEnum";
import Sensor from "types/Sensor";
import MeasurementTypeEnum, {
  MeasurementTypeLabelsEnum,
} from "types/MeasurementTypeEnum";
import {
  DateRange,
  DateRegexGroupsInterface,
  DateRegex,
} from "utils/date.range";
import GroupMeasurementByEnum from "types/GroupMeasurementByEnum";
import {
  getDaysInMonth,
  format,
  addDays,
  addMonths,
  startOfYear,
  startOfWeek,
  getDate,
} from "date-fns";
import TimeSeriesChart from "components/TimeSeriesChart";
import Measurement from "types/Measurement";
import { AxisDomain } from "recharts";

const styles = () =>
  createStyles({
    root: {
      //border: '1px solid #000',
      backgroundColor: ColorsEnum.BGLIGHT,
      padding: "20px",
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
  sensor: Sensor;
  type: MeasurementTypeEnum;
  date: DateRegex;
  groupBy: GroupMeasurementByEnum;
  measurements: Measurement[];
}

export const getZeroPaddedNumber = (num: number) => {
  return `${num < 10 ? "0" : ""}${num}`;
};

const SensorCanvas: React.FunctionComponent<
  SensorCanvasProps & WithStyles<typeof styles>
> = (props) => {
  const { sensor, type, classes, date, groupBy, measurements } = props;

  if (!sensor.visible) {
    return null;
  }

  const groupByProperties = {
    [GroupMeasurementByEnum.day]: {
      unit: "h",
      tickFormatter: (d) => `${getZeroPaddedNumber(d - 1)}`,
      ticks: Array.from({ length: 25 }, (data, i) => i + 1),
      getTimeDomain: (params: DateRegexGroupsInterface) =>
        params.hour + params.minute / 60.0 + 1,
    },
    [GroupMeasurementByEnum.week]: {
      unit: "",
      tickFormatter: (d) => `${format(addDays(startOfWeek(d), d - 1), "EE")}`,
      ticks: Array.from({ length: 7 }, (data, i) => i + 1),
      getTimeDomain: (params: DateRegexGroupsInterface) =>
        params.day - getDate(DateRange.parse(date).from) + 1,
    },
    [GroupMeasurementByEnum.month]: {
      unit: ".",
      tickFormatter: (d) => `${d}`,
      ticks: Array.from(
        { length: getDaysInMonth(DateRange.parse(date).from) },
        (data, i) => i + 1
      ),
      getTimeDomain: (params: DateRegexGroupsInterface) => params.day,
    },
    [GroupMeasurementByEnum.year]: {
      unit: "",
      tickFormatter: (d) =>
        `${format(addMonths(startOfYear(d), d - 1), "LLL")}`,
      ticks: Array.from({ length: 12 }, (data, i) => i + 1),
      getTimeDomain: (params: DateRegexGroupsInterface) => params.month,
    },
  };

  return (
    <>
      <Card className={classes.root}>
        <Typography
          variant="h6"
          style={{ marginBottom: "15px", fontWeight: "normal" }}
        >
          {MeasurementTypeLabelsEnum[type]}
        </Typography>
        <TimeSeriesChart
          chartData={[
            ...(measurements || []).map((m) => ({
              time: groupByProperties[groupBy].getTimeDomain(
                DateRange.getRegexGroups(m.createdAt)
              ),
              value: m.measurement,
              labelTime: m.createdAt,
            })),
          ]}
          ticks={groupByProperties[groupBy].ticks}
          tickFormatter={groupByProperties[groupBy].tickFormatter}
          dotSize={groupBy === GroupMeasurementByEnum.day ? 5 : 55}
          domain={
            Sensor.measurementTypeProperties[type].domain as [
              AxisDomain,
              AxisDomain
            ]
          }
          unit={{
            y: Sensor.measurementTypeProperties[type].unit,
            x: groupByProperties[groupBy].unit,
          }}
        />
      </Card>
    </>
  );
};

export default withStyles(styles)(observer(SensorCanvas));
