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
} from "recharts";
import ColorsEnum from "types/ColorsEnum";

interface ChartData {
  time: number;
  value: number;
}
interface TimeSeriesChartInterface {
  dotSize: number;
  ticks: any;
  chartData: ChartData[];
}

const dataMin = (chartData: ChartData[]) => {
  return 0; //Math.floor(Math.min(...chartData.map(c => c.value))) - 5;
};

const dataMax = (chartData: ChartData[]) => {
  return Math.floor(Math.max(...chartData.map((c) => c.value))) + 5;
};

const TimeSeriesChart = (props: TimeSeriesChartInterface) => (
  <ResponsiveContainer width="95%" height="90%">
    <ScatterChart>
      <XAxis
        dataKey="time"
        name="Time"
        ticks={props.ticks}
        tickFormatter={(t) => t}
        type="number"
        minTickGap={0}
        tick={{ fontSize: 15 }}
        allowDataOverflow={false}
      />
      <YAxis
        dataKey="value"
        name="Value"
        domain={[dataMin(props.chartData), dataMax(props.chartData)]}
        allowDataOverflow={false}
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
      />
      <CartesianGrid stroke={ColorsEnum.BGDARK} />
    </ScatterChart>
  </ResponsiveContainer>
);

export default TimeSeriesChart;
