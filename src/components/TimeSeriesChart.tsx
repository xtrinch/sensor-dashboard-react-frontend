import React from "react";
import {
  AxisDomain,
  CartesianGrid,
  ResponsiveContainer,
  Scatter,
  ScatterChart,
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
    data: ChartPoint[];
  }[];
  domain: [AxisDomain, AxisDomain];
  tickFormatter: (value: any) => any;
  unit: {
    x: string;
    y: string;
  };
}

const TimeSeriesChart = (props: TimeSeriesChartInterface) => (
  <ResponsiveContainer width="95%" height="90%">
    <ScatterChart>
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
        interval={0}
        domain={[props.ticks[0] - 1, props.ticks[props.ticks.length - 1] + 1]}
        //unit={props.unit.x}
      />
      <YAxis
        dataKey="value"
        name="Value"
        // domain={[dataMin(props.chartData), dataMax(props.chartData)]}
        domain={props.domain}
        allowDataOverflow={false}
        type="number"
        unit={props.unit.y}
        tick={{ fontSize: 13, fill: ColorsEnum.PINK }}
        stroke={ColorsEnum.GRAY}
      />
      <ZAxis range={[props.dotSize, props.dotSize]} />
      <Tooltip
        formatter={(value, unit, payload, index) =>
          unit === "Time" ? `${payload.payload.labelTime}` : `${value}`
        }
        isAnimationActive={false}
      />
      <CartesianGrid stroke={ColorsEnum.BGDARK} />
      {props.chartData.map((line, index) => (
        <Scatter
          data={line.data}
          line={{ stroke: GraphColors[index] }}
          lineJointType="monotoneX"
          lineType="joint"
          name="Values"
          strokeWidth={2}
          isAnimationActive={false}
          fill={ColorsEnum.WHITE} // dot color
          id={`${index}`}
        />
      ))}
    </ScatterChart>
  </ResponsiveContainer>
);

export default TimeSeriesChart;
