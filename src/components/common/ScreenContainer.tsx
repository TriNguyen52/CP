import React from "react";
import { SafeAreaView, ScrollView, StyleSheet, ViewStyle } from "react-native";

import { colors, spacing } from "../../theme/tokens";

type ScreenContainerProps = {
  children: React.ReactNode;
  contentStyle?: ViewStyle;
};

export function ScreenContainer({ children, contentStyle }: ScreenContainerProps) {
  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[styles.content, contentStyle]}
        showsVerticalScrollIndicator={false}
      >
        {children}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scroll: {
    flex: 1,
  },
  content: {
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.xl,
    backgroundColor: colors.background,
  },
});
