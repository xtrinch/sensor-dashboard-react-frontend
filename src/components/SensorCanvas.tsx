import { createStyles, Card, Typography } from "@material-ui/core";
import { withStyles, WithStyles } from "@material-ui/styles";
import React from "react";
import { observer } from "mobx-react";
import ColorsEnum from "types/ColorsEnum";
import Sensor from "types/Sensor";
import MeasurementTypeEnum from "types/MeasurementTypeEnum";
import { DateRange } from "utils/date.range";
import GroupMeasurementByEnum from "types/GroupMeasurementByEnum";
import { getDaysInMonth } from "date-fns";
import TimeSeriesChart from "components/TimeSeriesChart";
import Measurement from "types/Measurement";

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
  date: string;
  groupBy: GroupMeasurementByEnum;
  measurements: Measurement[];
}

const SensorCanvas: React.FunctionComponent<
  SensorCanvasProps & WithStyles<typeof styles>
> = (props) => {
  const { sensor, type, classes, date, groupBy, measurements } = props;

  if (!sensor.visible) {
    return null;
  }

  const getTickValues = (): {
    x?: number[];
    y?: number[];
  } => {
    // const y: number[] = Array.from({ length: 1000 });
    let x: number[];

    switch (groupBy) {
      case GroupMeasurementByEnum.day:
        x = Array.from({ length: 24 }, (data, i) => (i % 2 === 0 ? i : 0));
        break;
      case GroupMeasurementByEnum.week:
        x = Array.from({ length: 7 }, (data, i) => i);
        break;
      case GroupMeasurementByEnum.month:
        x = Array.from(
          { length: getDaysInMonth(DateRange.parse(date).from) + 1 },
          (data, i) => i
        );
        break;
      case GroupMeasurementByEnum.year:
        x = Array.from({ length: 12 }, (data, i) => i);
        break;
      default:
        break;
    }

    return { x };
  };

  // const getTickFormat = (): {
  //   x?: any[] | { (tick: any, index: number, ticks: any[]): string | number };
  //   y?: any[] | { (tick: any, index: number, ticks: any[]): string | number };
  // } => {
  //   switch (groupBy) {
  //     case GroupMeasurementByEnum.day:
  //       return { x: (d) => `${d}h` };
  //     // case GroupMeasurementByEnum.week:
  //     //   return {
  //     //     x: d =>
  //     //       `${format(
  //     //         addDays(startOfWeek(this.selectedDate), d),
  //     //         'EE'
  //     //       )}`
  //     //   };
  //     case GroupMeasurementByEnum.month:
  //       return { x: (d) => `${d + 1}` };
  //     case GroupMeasurementByEnum.year:
  //       return {
  //         x: (d) =>
  //           `${format(addMonths(startOfYear(this.selectedDate), d), "LLL")}`,
  //       };
  //     default:
  //       return {};
  //   }
  // };

  const tickValues = getTickValues();
  // const tickFormat = getTickFormat();

  const getTimeDomain = (date: string) => {
    const { day, hour, month, minute } = DateRange.getRegexGroups(date);
    switch (groupBy) {
      case GroupMeasurementByEnum.year:
        return month;
      case GroupMeasurementByEnum.month:
        return day;
      case GroupMeasurementByEnum.week:
        return day;
      case GroupMeasurementByEnum.day:
        return hour + minute / 60.0;
    }
  };

  return (
    <>
      <Card className={classes.root}>
        <Typography variant="h6" style={{ marginBottom: "15px" }}>
          {sensor.name} ({type})
        </Typography>
        <TimeSeriesChart
          chartData={[
            ...(measurements || []).map((m) => ({
              time: getTimeDomain(m.createdAt),
              value: m.measurement,
            })),
          ]}
          ticks={tickValues.x}
          dotSize={groupBy === GroupMeasurementByEnum.day ? 5 : 55}
        />
      </Card>
    </>
  );
};

export default withStyles(styles)(observer(SensorCanvas));
