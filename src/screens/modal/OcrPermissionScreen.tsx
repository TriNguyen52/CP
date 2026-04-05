import React from "react";
import { View, Text, StyleSheet } from "react-native";

import { AppStatusBar } from "../../components/common/AppStatusBar";
import { NavigationHeader } from "../../components/common/NavigationHeader";
import { PrimaryButton } from "../../components/common/Buttons";
import { ScreenContainer } from "../../components/common/ScreenContainer";
import { colors, radius, spacing, typography } from "../../theme/tokens";

export function OcrPermissionScreen() {
  return (
    <ScreenContainer contentStyle={styles.content}>
      <AppStatusBar />
      <NavigationHeader title="OCR Scanning" />

      <View style={styles.preview} />

      <Text style={styles.title}>OCR Scanning</Text>
      <Text style={styles.description}>Allow access to your camera for OCR scanning</Text>

      <PrimaryButton label="Enable Camera" style={styles.button} />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingTop: spacing.sm,
    paddingBottom: spacing.xl,
  },
  preview: {
    height: 204,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.card,
    marginBottom: spacing.lg,
  },
  title: {
    color: colors.textPrimary,
    fontFamily: typography.semiBold,
    fontSize: 22,
  },
  description: {
    color: colors.textSecondary,
    fontFamily: typography.regular,
    fontSize: 15,
    marginTop: spacing.xs,
  },
  button: {
    marginTop: spacing.xl,
  },
});
