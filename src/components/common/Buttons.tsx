import React from "react";
import { Pressable, Text, StyleSheet, ViewStyle } from "react-native";

import { colors, radius, spacing, typography } from "../../theme/tokens";

type BaseButtonProps = {
  label: string;
  onPress?: () => void;
  style?: ViewStyle;
};

export function PrimaryButton({ label, onPress, style }: BaseButtonProps) {
  return (
    <Pressable style={[styles.primary, style]} onPress={onPress}>
      <Text style={styles.primaryText}>{label}</Text>
    </Pressable>
  );
}

export function SecondaryButton({ label, onPress, style }: BaseButtonProps) {
  return (
    <Pressable style={[styles.secondary, style]} onPress={onPress}>
      <Text style={styles.secondaryText}>{label}</Text>
    </Pressable>
  );
}

type IconButtonProps = {
  children: React.ReactNode;
  onPress?: () => void;
};

export function IconButton({ children, onPress }: IconButtonProps) {
  return (
    <Pressable style={styles.iconButton} onPress={onPress}>
      {children}
    </Pressable>
  );
}

type FloatingActionButtonProps = {
  label: string;
  onPress?: () => void;
};

export function FloatingActionButton({ label, onPress }: FloatingActionButtonProps) {
  return (
    <Pressable style={styles.fab} onPress={onPress}>
      <Text style={styles.fabText}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  primary: {
    backgroundColor: "#FFFFFF",
    borderRadius: radius.pill,
    minHeight: 50,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: spacing.lg,
  },
  primaryText: {
    color: "#000000",
    fontFamily: typography.semiBold,
    fontSize: 16,
  },
  secondary: {
    backgroundColor: "transparent",
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: colors.border,
    minHeight: 44,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: spacing.lg,
  },
  secondaryText: {
    color: colors.textPrimary,
    fontFamily: typography.semiBold,
    fontSize: 16,
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: radius.full,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
  },
  fab: {
    width: 72,
    height: 72,
    borderRadius: radius.full,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFFFFF",
    borderWidth: 3,
    borderColor: colors.cardStrong,
  },
  fabText: {
    color: "#000000",
    fontFamily: typography.semiBold,
    fontSize: 12,
    textAlign: "center",
    paddingHorizontal: 6,
  },
});
