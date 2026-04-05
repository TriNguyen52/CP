import React from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { colors, radius, spacing, typography } from "../../theme/tokens";

type NavigationHeaderProps = {
  title: string;
  onBackPress?: () => void;
  rightAction?: React.ReactNode;
};

export function NavigationHeader({
  title,
  onBackPress,
  rightAction,
}: NavigationHeaderProps) {
  return (
    <View style={styles.container}>
      <View style={styles.side}>
        {onBackPress ? (
          <Pressable style={styles.iconButton} onPress={onBackPress}>
            <Ionicons name="chevron-back" size={20} color={colors.textPrimary} />
          </Pressable>
        ) : (
          <View style={styles.placeholder} />
        )}
      </View>
      <Text style={styles.title}>{title}</Text>
      <View style={styles.side}>{rightAction ?? <View style={styles.placeholder} />}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.md,
  },
  title: {
    color: colors.textPrimary,
    fontFamily: typography.semiBold,
    fontSize: 20,
  },
  side: {
    width: 40,
    alignItems: "center",
  },
  placeholder: {
    width: 36,
    height: 36,
  },
  iconButton: {
    width: 36,
    height: 36,
    borderRadius: radius.full,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
  },
});
