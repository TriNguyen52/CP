import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { colors, radius, spacing, typography } from "../../theme/tokens";

type FeatureCardProps = {
  title: string;
  description: string;
  icon: keyof typeof Ionicons.glyphMap;
};

export function FeatureCard({ title, description, icon }: FeatureCardProps) {
  return (
    <View style={styles.card}>
      <View style={styles.iconWrap}>
        <Ionicons name={icon} size={20} color={colors.textPrimary} />
      </View>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.description}>{description}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    minHeight: 168,
    borderRadius: radius.lg,
    padding: spacing.md,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    gap: spacing.sm,
  },
  iconWrap: {
    width: 44,
    height: 44,
    borderRadius: radius.full,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.cardStrong,
  },
  title: {
    color: colors.textPrimary,
    fontFamily: typography.semiBold,
    fontSize: 16,
  },
  description: {
    color: colors.textSecondary,
    fontFamily: typography.regular,
    fontSize: 13,
    lineHeight: 18,
  },
});
