import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { colors, spacing, typography } from "../../theme/tokens";

export function AppStatusBar() {
  return (
    <View style={styles.container}>
      <Text style={styles.time}>10:00 AM</Text>
      <View style={styles.icons}>
        <Ionicons name="cellular" size={16} color={colors.textPrimary} />
        <Ionicons name="wifi" size={16} color={colors.textPrimary} />
        <Ionicons name="battery-full" size={18} color={colors.textPrimary} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: spacing.md,
    paddingTop: spacing.sm,
    paddingBottom: spacing.sm,
  },
  time: {
    color: colors.textPrimary,
    fontFamily: typography.semiBold,
    fontSize: 14,
    letterSpacing: 0.2,
  },
  icons: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs,
  },
});
