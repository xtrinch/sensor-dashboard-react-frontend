import React from "react";
import {
  VictoryChart,
  VictoryLine,
  VictoryScatter,
  VictoryAxis,
} from "victory";
import ColorsEnum from "types/ColorsEnum";
import ContainerWidthSizer from "components/ContainerWidthSizer";
import { CSSProperties } from "@material-ui/core/styles/withStyles";

interface ChartProps {
  chartType: "line" | "bar";
  graphData: {
    x: Date;
    y: number;
  }[];
  style?: CSSProperties;
  className?: string;
  domain?: {
    xMin?: Date;
    yMin?: number;
    xMax?: Date;
    yMax?: number;
  };
}

export const Chart: React.FunctionComponent<ChartProps> = (props) => {
  const { graphData, style, className, domain } = props;

  return (
    <div style={style} className={className}>
      <ContainerWidthSizer style={{ height: "100%" }}>
        {({ width, height }) => (
          <svg
            viewBox={`0 0 ${width} ${height}`}
            preserveAspectRatio="none"
            width="100%"
          >
            <VictoryChart
              style={{
                parent: {
                  border: "0px solid #ccc",
                  margin: "0 auto",
                  maxWidth: "100%",
                },
              }}
              padding={{ top: 25, bottom: 30, left: 50, right: 25 }}
              scale={{ x: "time" }}
              width={width}
              height={height}
              standalone={false}
              maxDomain={{
                x: (domain.xMax as unknown) as number,
                y: domain.yMax,
              }}
              minDomain={{
                x: (domain.xMin as unknown) as number,
                y: domain.yMin,
              }}
            >
              <VictoryAxis
                crossAxis={false}
                style={{
                  axis: {
                    stroke: ColorsEnum.BGDARK,
                  },
                  grid: {
                    strokeWidth: 0,
                  },
                  tickLabels: {
                    fill: ColorsEnum.GRAY,
                    fontSize: 17,
                    fontWeight: "normal",
                    padding: 10,
                  },
                }}
              />
              <VictoryAxis
                dependentAxis
                style={{
                  axis: {
                    strokeWidth: 0,
                  },
                  grid: {
                    strokeWidth: 1,
                    stroke: ColorsEnum.BGDARK,
                  },
                  tickLabels: {
                    fill: ColorsEnum.GRAY,
                    fontSize: 17,
                    fontWeight: "normal",
                  },
                }}
              />
              <VictoryLine
                data={graphData}
                style={{
                  data: {
                    stroke: ColorsEnum.VIOLET,
                    strokeWidth: 2,
                  },
                }}
              />
              <VictoryScatter
                data={graphData}
                size={4}
                style={{
                  data: {
                    fill: (x) => (x.datum ? x.datum.color : "red"),
                  },
                }}
              />
            </VictoryChart>
          </svg>
        )}
      </ContainerWidthSizer>
    </div>
  );
};
