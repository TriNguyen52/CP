import React from "react";
import Svg, { Path } from "react-native-svg";

import { colors } from "../../theme/tokens";

type LineChartMiniProps = {
  data?: number[];
  width?: number;
  height?: number;
};

const buildPath = (data: number[], width: number, height: number): string => {
  if (data.length === 0) {
    return "";
  }

  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  const stepX = width / Math.max(data.length - 1, 1);

  return data
    .map((value, index) => {
      const x = index * stepX;
      const normalized = (value - min) / range;
      const y = height - normalized * height;
      return `${index === 0 ? "M" : "L"}${x.toFixed(2)} ${y.toFixed(2)}`;
    })
    .join(" ");
};

export function LineChartMini({
  data = [12, 18, 14, 22, 24, 20, 28],
  width = 110,
  height = 40,
}: LineChartMiniProps) {
  const path = buildPath(data, width, height);

  return (
    <Svg width={width} height={height}>
      <Path
        d={path}
        stroke={colors.textPrimary}
        strokeWidth={2.2}
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}
