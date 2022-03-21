import React from 'react';
import {
  CartesianGrid,
  ComposedChart,
  Label,
  Legend,
  Line,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import ColorsEnum, { GraphColors } from 'types/ColorsEnum';

// TODO
type AxisDomain = any;

export interface ChartPoint {
  name: string;
  time: number;
  labelTime: string;
}

export interface ChartData {
  name: string;
  ordering: number;
  label: string;
}
interface TimeSeriesChartInterface {
  ticks: number[];
  chartData: ChartData[]; // info about sensors - one in array per each sensor
  data: ChartPoint[]; // actual datapoints
  domain: [AxisDomain, AxisDomain];
  tickFormatter: (value: any) => any;
  unit: {
    x: string;
    y: string;
  };
  nowX: number;
  dotSize: number;
}

const TimeSeriesChart = (props: TimeSeriesChartInterface) => {
  const { chartData, data, ticks, tickFormatter, domain, nowX } = props;
  return (
    <ResponsiveContainer width="95%" height="90%">
      <ComposedChart data={data}>
        <XAxis
          dataKey="time"
          name="Time"
          ticks={ticks}
          tickFormatter={tickFormatter}
          type="number"
          minTickGap={0}
          tick={{ fontSize: 13, fill: ColorsEnum.PINK }}
          stroke={ColorsEnum.GRAY}
          interval={'preserveStartEnd'}
          domain={[ticks[0], ticks[ticks.length - 1]]}
        />
        <YAxis
          domain={domain}
          allowDataOverflow={true}
          type="number"
          unit={props.unit.y}
          tick={{ fontSize: 13, fill: ColorsEnum.PINK }}
          stroke={ColorsEnum.GRAY}
        />
        {/* <ZAxis range={[props.dotSize, props.dotSize]} /> */}
        <CartesianGrid stroke={ColorsEnum.BGLIGHT} />
        {data.length > 0 && (
          <Tooltip
            formatter={(value, unit, payload, index) =>
              unit === 'Time'
                ? `${payload.payload.labelTime}`
                : `${value} (${payload.payload.labelTime})`
            }
            isAnimationActive={false}
            cursor={{ stroke: ColorsEnum.BGLIGHTER }}
            labelFormatter={(label: string | number) => ``}
            contentStyle={{
              backgroundColor: ColorsEnum.BGDARK,
              borderWidth: '1px',
              borderColor: ColorsEnum.BGLIGHTER,
            }}
          />
        )}
        {chartData.map((line, index) => (
          <Line
            key={line.name}
            dataKey={line.name}
            name={chartData[index]?.label}
            strokeWidth={1}
            isAnimationActive={false}
            fill={GraphColors[line.ordering] || 'white'} // dot color
            id={`${line.name}`}
            stroke={GraphColors[line.ordering]}
            dot={{ r: 1.5 }}
            connectNulls={true}
          />
        ))}
        <Legend verticalAlign="top" height={25} iconType={'circle'} />
        <ReferenceLine
          x={nowX}
          stroke={ColorsEnum.OLIVE}
          strokeWidth={1}
          label={<Label value="now" offset={5} position="insideTopLeft" fill={ColorsEnum.GRAY} />}
        />
      </ComposedChart>
    </ResponsiveContainer>
  );
};

export default TimeSeriesChart;
