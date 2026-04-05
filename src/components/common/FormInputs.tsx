import React from "react";
import { View, TextInput, StyleSheet, TextInputProps } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { colors, radius, spacing, typography } from "../../theme/tokens";
import { IconButton } from "./Buttons";

type IconTextInputProps = TextInputProps & {
  icon: keyof typeof Ionicons.glyphMap;
};

export function IconTextInput({ icon, ...props }: IconTextInputProps) {
  return (
    <View style={styles.container}>
      <Ionicons name={icon} size={20} color={colors.textSecondary} />
      <TextInput
        placeholderTextColor={colors.textMuted}
        style={styles.input}
        {...props}
      />
    </View>
  );
}

type CameraTextInputProps = TextInputProps & {
  icon: keyof typeof Ionicons.glyphMap;
  onCameraPress?: () => void;
};

export function CameraTextInput({
  icon,
  onCameraPress,
  ...props
}: CameraTextInputProps) {
  return (
    <View style={styles.container}>
      <Ionicons name={icon} size={20} color={colors.textSecondary} />
      <TextInput
        placeholderTextColor={colors.textMuted}
        style={styles.input}
        {...props}
      />
      <IconButton onPress={onCameraPress}>
        <Ionicons name="camera-outline" size={18} color={colors.textPrimary} />
      </IconButton>
    </View>
  );
}

type DateCvvInputRowProps = {
  expiryProps?: TextInputProps;
  cvvProps?: TextInputProps;
};

export function DateCvvInputRow({ expiryProps, cvvProps }: DateCvvInputRowProps) {
  return (
    <View style={styles.row}>
      <View style={[styles.container, styles.half]}>
        <TextInput
          placeholder="MM/YY"
          placeholderTextColor={colors.textMuted}
          style={styles.input}
          {...expiryProps}
        />
      </View>
      <View style={[styles.container, styles.half]}>
        <TextInput
          placeholder="CVV"
          placeholderTextColor={colors.textMuted}
          style={styles.input}
          secureTextEntry
          {...cvvProps}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.card,
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: radius.lg,
    paddingHorizontal: spacing.md,
    minHeight: 56,
  },
  input: {
    flex: 1,
    marginLeft: spacing.sm,
    color: colors.textPrimary,
    fontFamily: typography.regular,
    fontSize: 15,
  },
  row: {
    flexDirection: "row",
    gap: spacing.sm,
  },
  half: {
    flex: 1,
  },
});
