import React from "react";
import { View, StyleSheet } from "react-native";
import Svg, { Path } from "react-native-svg";

import { colors } from "../../theme/tokens";

type LineChartLargeProps = {
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

export function LineChartLarge({
  data = [24, 28, 20, 34, 31, 45, 52, 48, 58],
  width = 320,
  height = 180,
}: LineChartLargeProps) {
  const path = buildPath(data, width, height);

  return (
    <View style={styles.wrapper}>
      <Svg width={width} height={height}>
        <Path
          d={path}
          stroke={colors.textPrimary}
          strokeWidth={3}
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </Svg>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    alignItems: "center",
    justifyContent: "center",
  },
});
