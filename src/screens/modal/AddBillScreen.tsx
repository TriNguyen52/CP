import React from "react";
import { View, Text, StyleSheet } from "react-native";

import { AppStatusBar } from "../../components/common/AppStatusBar";
import { FeatureCard } from "../../components/cards/FeatureCard";
import { NavigationHeader } from "../../components/common/NavigationHeader";
import { ScreenContainer } from "../../components/common/ScreenContainer";
import { colors, spacing, typography } from "../../theme/tokens";

const options = [
  {
    title: "Create New Group",
    description: "Start a fresh bill group and invite members.",
    icon: "add-circle-outline",
  },
  {
    title: "Join Existing",
    description: "Enter a code to join an existing bill group.",
    icon: "people-outline",
  },
  {
    title: "Quick Split",
    description: "Split one receipt in a few taps.",
    icon: "flash-outline",
  },
  {
    title: "Recurring Bills",
    description: "Set up monthly recurring bill templates.",
    icon: "repeat-outline",
  },
] as const;

export function AddBillScreen() {
  return (
    <ScreenContainer contentStyle={styles.content}>
      <AppStatusBar />
      <NavigationHeader title="Create a New Bill Group" />
      <Text style={styles.subtitle}>Join an Existing Bill Group</Text>
      <Text style={styles.sectionTitle}>Bill Group Options</Text>

      <View style={styles.grid}>
        {options.map((option) => (
          <View key={option.title} style={styles.gridCell}>
            <FeatureCard
              title={option.title}
              description={option.description}
              icon={option.icon}
            />
          </View>
        ))}
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingTop: spacing.sm,
    paddingBottom: spacing.xl,
  },
  subtitle: {
    color: colors.textSecondary,
    fontFamily: typography.regular,
    fontSize: 15,
    marginBottom: spacing.sm,
  },
  sectionTitle: {
    color: colors.textPrimary,
    fontFamily: typography.semiBold,
    fontSize: 20,
    marginBottom: spacing.md,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginHorizontal: -6,
  },
  gridCell: {
    width: "50%",
    paddingHorizontal: 6,
    marginBottom: spacing.sm,
  },
});
