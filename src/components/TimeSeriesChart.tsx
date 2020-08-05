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
  labelTime: string;
}
interface TimeSeriesChartInterface {
  dotSize: number;
  ticks: number[];
  chartData: ChartData[];
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
        formatter={(value, unit, prps, index) =>
          unit === "Time" ? `${props.chartData[index]?.labelTime}` : `${value}`
        }
        isAnimationActive={false}

        //cursor={{ stroke: 'red', strokeWidth: 2 }}
      />
      <CartesianGrid stroke={ColorsEnum.BGDARK} />
      <Scatter
        data={props.chartData}
        line={{ stroke: ColorsEnum.GRAY }}
        lineJointType="monotoneX"
        lineType="joint"
        name="Values"
        strokeWidth={1}
        isAnimationActive={false}
        fill={ColorsEnum.WHITE} // dot color
      />
    </ScatterChart>
  </ResponsiveContainer>
);

export default TimeSeriesChart;
