import React from "react";
import {
  AxisDomain,
  CartesianGrid,
  Label,
  Legend,
  Line,
  LineChart,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  ZAxis,
} from "recharts";
import ColorsEnum, { GraphColors } from "types/ColorsEnum";

interface ChartPoint {
  time: number;
  value: number;
  labelTime: string;
}
interface TimeSeriesChartInterface {
  dotSize: number;
  ticks: number[];
  chartData: {
    name: string;
    ordering: number;
  }[];
  data: ChartPoint[];
  domain: [AxisDomain, AxisDomain];
  tickFormatter: (value: any) => any;
  unit: {
    x: string;
    y: string;
  };
  nowX: number;
}

const TimeSeriesChart = (props: TimeSeriesChartInterface) => {
  return (
    <ResponsiveContainer width="95%" height="90%">
      <LineChart data={props.data}>
        <XAxis
          dataKey="time"
          name="Time"
          ticks={props.ticks}
          tickFormatter={props.tickFormatter}
          type="number"
          minTickGap={0}
          tick={{ fontSize: 13, fill: ColorsEnum.PINK }}
          stroke={ColorsEnum.GRAY}
          allowDataOverflow={false}
          interval={"preserveStartEnd"}
          domain={[props.ticks[0], props.ticks[props.ticks.length - 1]]}
          //unit={props.unit.x}
        />
        <YAxis
          dataKey="value"
          name="Value"
          domain={props.domain}
          allowDataOverflow={false}
          type="number"
          unit={props.unit.y}
          tick={{ fontSize: 13, fill: ColorsEnum.PINK }}
          stroke={ColorsEnum.GRAY}
        />
        <ZAxis range={[props.dotSize, props.dotSize]} />
        <Legend verticalAlign="top" height={25} iconType={"circle"} />
        <CartesianGrid stroke={ColorsEnum.BGLIGHT} />
        {props.chartData.length > 0 && (
          <Tooltip
            formatter={(value, unit, payload, index) =>
              unit === "Time"
                ? `${payload.payload.labelTime}`
                : `${value} (${payload.payload.labelTime})`
            }
            isAnimationActive={false}
            cursor={{ stroke: ColorsEnum.BGLIGHTER }}
            labelFormatter={(label: string | number) => ``}
            contentStyle={{
              backgroundColor: ColorsEnum.BGDARK,
              borderWidth: "1px",
              borderColor: ColorsEnum.BGLIGHTER,
            }}
          />
        )}
        {props.chartData.map((line, index) => (
          <Line
            key={index}
            dataKey={line.name}
            name={line.name}
            strokeWidth={1}
            isAnimationActive={false}
            fill={GraphColors[line.ordering] || "white"} // dot color
            id={`${index}`}
            stroke={GraphColors[line.ordering]}
            dot={{ r: 1.5 }}
          />
        ))}
        <ReferenceLine
          x={props.nowX}
          stroke={ColorsEnum.OLIVE}
          strokeWidth={1}
          label={
            <Label
              value="now"
              offset={5}
              position="insideTopLeft"
              fill={ColorsEnum.GRAY}
            />
          }
        />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default TimeSeriesChart;
