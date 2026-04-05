import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { StackScreenProps } from "@react-navigation/stack";

import { AppStatusBar } from "../../components/common/AppStatusBar";
import { PrimaryButton, SecondaryButton } from "../../components/common/Buttons";
import { ScreenContainer } from "../../components/common/ScreenContainer";
import { colors, radius, spacing, typography } from "../../theme/tokens";
import { AuthStackParamList } from "../../types/navigation";

type CreateAccountScreenProps = StackScreenProps<AuthStackParamList, "CreateAccount">;

export function CreateAccountScreen({ navigation }: CreateAccountScreenProps) {
  return (
    <ScreenContainer contentStyle={styles.content}>
      <AppStatusBar />
      <View style={styles.heroCircle} />
      <Text style={styles.title}>Minimal</Text>
      <Text style={styles.subtitle}>Split bills effortlessly</Text>
      <Text style={styles.description}>Join the community of smart spenders</Text>
      <View style={styles.actions}>
        <PrimaryButton label="Create Account" onPress={() => navigation.navigate("Onboarding")} />
        <SecondaryButton label="I already have an account" onPress={() => navigation.navigate("Onboarding")} />
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  content: {
    alignItems: "center",
    paddingTop: spacing.sm,
    paddingBottom: spacing.xl,
  },
  heroCircle: {
    width: 338,
    height: 338,
    borderRadius: radius.full,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.card,
    marginTop: spacing.xl,
  },
  title: {
    marginTop: spacing.xl,
    color: colors.textPrimary,
    fontFamily: typography.semiBold,
    fontSize: 44,
    letterSpacing: 0.5,
  },
  subtitle: {
    marginTop: spacing.xs,
    color: colors.textSecondary,
    fontFamily: typography.regular,
    fontSize: 20,
  },
  description: {
    marginTop: spacing.sm,
    color: colors.textMuted,
    fontFamily: typography.regular,
    fontSize: 14,
  },
  actions: {
    width: "100%",
    marginTop: spacing.xl,
    gap: spacing.sm,
  },
});
