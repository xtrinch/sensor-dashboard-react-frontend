import { ResponsiveLine } from "@nivo/line";
import React from "react";
import ColorsEnum, { GraphColors } from "types/ColorsEnum";

interface LineProps {
  data: {
    id: string;
    label: string;
    data: {
      x: any;
      y: number;
    }[];
    ordering: number;
  }[];
  from: string;
  to: string;
  domain: [number, number];
  xFormat: string;
  tickFormat: string;
  unit: {
    x: string;
    y: string;
  };
}

const Chart = (props: LineProps) => {
  const { domain, from, to, data, unit, tickFormat, xFormat } = props;
  return (
    <ResponsiveLine
      data={data}
      animate={false}
      margin={{ top: 30, right: 30, bottom: 20, left: 65 }}
      xScale={{
        type: "time",
        format: xFormat,
        min: from,
        max: to,
        useUTC: false,
      }}
      xFormat={`time:${xFormat}`}
      yScale={{
        type: "linear",
        min:
          domain[0] !== undefined
            ? domain[0]
            : (data.reduce(
                (acc, item) =>
                  Math.min(
                    acc,
                    item.data.reduce(
                      (acc1, item1) => Math.min(acc1, item1.y),
                      1000000
                    )
                  ),
                1000000
              ) as number),
        max: domain[1],
      }}
      axisTop={null}
      axisRight={null}
      enableGridY={true}
      // gridYValues={[0, 100, 200, 300, 400, 500, 600, 700, 800, 900, 1000]}
      enableGridX={true}
      axisBottom={{
        orient: "bottom",
        tickSize: 5,
        tickPadding: 5,
        tickRotation: 0,
        legendOffset: 36,
        legendPosition: "middle",
        format: tickFormat, // needs to match xScale format
        //tickValues: "every 4 hours",
      }}
      axisLeft={{
        orient: "left",
        tickSize: 5,
        tickPadding: 5,
        tickRotation: 0,
        legendOffset: -40,
        legendPosition: "middle",
        //tickValues: yValues,
        format: (v) => `${v} ${unit.y}`,
      }}
      pointSize={2}
      pointColor={{ theme: "background" }}
      pointBorderWidth={2}
      pointBorderColor={{ from: "serieColor" }}
      pointLabelYOffset={-12}
      useMesh={true}
      markers={[
        {
          axis: "x" as any,
          value: new Date(),
          lineStyle: { stroke: ColorsEnum.OLIVE, strokeWidth: 1 },
          textStyle: {
            fill: ColorsEnum.OLIVE,
          },
          legend: "now",
        },
      ]}
      theme={{
        axis: {
          ticks: {
            line: {
              strokeWidth: 0,
            },
            text: {
              fill: ColorsEnum.PINK,
              fontSize: 12,
              fontFamily: "Roboto",
            },
          },
        },
        grid: {
          line: {
            stroke: ColorsEnum.BGLIGHT,
            strokeWidth: 1,
          },
        },
        crosshair: {
          line: {
            stroke: ColorsEnum.GRAY,
            strokeWidth: 1,
            strokeOpacity: 0.75,
            strokeDasharray: "6 6",
          },
        },
        tooltip: {
          container: {
            background: ColorsEnum.BGLIGHTER,
            color: "inherit",
            fontSize: "inherit",
            borderRadius: "0px",
            boxShadow: "none",
            padding: "5px 9px",
          },
          basic: {
            whiteSpace: "pre",
            display: "flex",
            alignItems: "center",
          },
          table: {},
          tableCell: {
            padding: "3px 5px",
          },
        },
        legends: {
          text: {
            fill: ColorsEnum.GRAY,
            fontSize: "13px",
            fontFamily: "Roboto",
          },
        },
      }}
      colors={data.map((dd) => GraphColors[dd.ordering])}
      lineWidth={1}
      legends={[
        {
          anchor: "top-left",
          direction: "row",
          justify: false,
          //translateX: 100,
          translateY: -30,
          itemsSpacing: 30,
          itemDirection: "left-to-right",
          itemWidth: 100,
          itemHeight: 20,
          symbolSize: 11,
          //symbolShape: 'circle',
          symbolBorderColor: "transparent",
        },
      ]}
    />
  );
};

export default Chart;
