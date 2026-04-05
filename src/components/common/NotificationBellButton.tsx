import React from "react";
import { Pressable, StyleSheet, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { colors, radius } from "../../theme/tokens";

type NotificationBellButtonProps = {
  hasUnread: boolean;
  onPress: () => void;
};

export function NotificationBellButton({ hasUnread, onPress }: NotificationBellButtonProps) {
  return (
    <Pressable style={styles.button} onPress={onPress}>
      <Ionicons name="notifications-outline" size={20} color={colors.textPrimary} />
      {hasUnread ? <View style={styles.badge} /> : null}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    width: 36,
    height: 36,
    borderRadius: radius.full,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
  },
  badge: {
    position: "absolute",
    top: 8,
    right: 8,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#EF4444",
  },
});