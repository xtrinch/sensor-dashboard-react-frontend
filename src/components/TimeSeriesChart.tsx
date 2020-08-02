import React from "react";

import {
  ResponsiveContainer,
  Scatter,
  ScatterChart,
  XAxis,
  YAxis,
  ZAxis,
  CartesianGrid,
  Tooltip,
  AxisDomain,
} from "recharts";
import ColorsEnum from "types/ColorsEnum";

interface ChartData {
  time: number;
  value: number;
}
interface TimeSeriesChartInterface {
  dotSize: number;
  ticks: number[];
  chartData: ChartData[];
  domain: [AxisDomain, AxisDomain];
  tickFormatter: (value: any) => any;
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
        tick={{ fontSize: 13 }}
        allowDataOverflow={false}
        interval={0}
        domain={[props.ticks[0] - 1, props.ticks[props.ticks.length - 1] + 1]}
      />
      <YAxis
        dataKey="value"
        name="Value"
        // domain={[dataMin(props.chartData), dataMax(props.chartData)]}
        domain={props.domain}
        allowDataOverflow={false}
        type="number"
      />
      <ZAxis range={[props.dotSize, props.dotSize]} />
      <Tooltip />
      <Scatter
        data={props.chartData}
        line={{ stroke: "#eee" }}
        lineJointType="monotoneX"
        lineType="joint"
        name="Values"
        strokeWidth={1}
        isAnimationActive={false}
      />
      <CartesianGrid stroke={ColorsEnum.BGDARK} />
    </ScatterChart>
  </ResponsiveContainer>
);

export default TimeSeriesChart;
