import React, { useEffect, useRef } from "react";
import {
  ActivityIndicator,
  Animated,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { colors, radius, spacing, typography } from "../../theme/tokens";

type EmptyStateProps = {
  icon?: keyof typeof Ionicons.glyphMap;
  title: string;
  description: string;
  actionLabel?: string;
  onActionPress?: () => void;
};

export function EmptyState({
  icon = "folder-open-outline",
  title,
  description,
  actionLabel,
  onActionPress,
}: EmptyStateProps) {
  return (
    <View style={styles.stateContainer}>
      <View style={styles.stateIconWrap}>
        <Ionicons name={icon} size={32} color={colors.textSecondary} />
      </View>
      <Text style={styles.stateTitle}>{title}</Text>
      <Text style={styles.stateDescription}>{description}</Text>
      {actionLabel && onActionPress ? (
        <Pressable style={styles.stateButton} onPress={onActionPress}>
          <Text style={styles.stateButtonText}>{actionLabel}</Text>
        </Pressable>
      ) : null}
    </View>
  );
}

type ErrorStateProps = {
  title?: string;
  message: string;
  retryLabel?: string;
  onRetry?: () => void;
};

export function ErrorState({
  title = "Something went wrong",
  message,
  retryLabel = "Retry",
  onRetry,
}: ErrorStateProps) {
  return (
    <View style={styles.stateContainer}>
      <View style={styles.stateIconWrap}>
        <Ionicons name="alert-circle-outline" size={32} color={colors.warning} />
      </View>
      <Text style={styles.stateTitle}>{title}</Text>
      <Text style={styles.stateDescription}>{message}</Text>
      {onRetry ? (
        <Pressable style={styles.stateButton} onPress={onRetry}>
          <Text style={styles.stateButtonText}>{retryLabel}</Text>
        </Pressable>
      ) : null}
    </View>
  );
}

type LoadingStateProps = {
  label?: string;
};

export function LoadingState({ label = "Loading..." }: LoadingStateProps) {
  return (
    <View style={styles.loadingWrap}>
      <ActivityIndicator color={colors.textPrimary} />
      <Text style={styles.loadingLabel}>{label}</Text>
    </View>
  );
}

type SkeletonListProps = {
  count?: number;
  cardHeight?: number;
};

export function SkeletonList({ count = 4, cardHeight = 84 }: SkeletonListProps) {
  const pulseAnim = useRef(new Animated.Value(0.45)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 700,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 0.45,
          duration: 700,
          useNativeDriver: true,
        }),
      ])
    );

    loop.start();
    return () => loop.stop();
  }, [pulseAnim]);

  return (
    <View style={styles.skeletonListWrap}>
      {Array.from({ length: count }).map((_, index) => (
        <Animated.View
          key={`skeleton-${index}`}
          style={[
            styles.skeletonCard,
            {
              height: cardHeight,
              opacity: pulseAnim,
            },
          ]}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  stateContainer: {
    alignItems: "center",
    justifyContent: "center",
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.card,
    padding: spacing.lg,
    gap: spacing.sm,
  },
  stateIconWrap: {
    width: 64,
    height: 64,
    borderRadius: radius.full,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.cardStrong,
  },
  stateTitle: {
    color: colors.textPrimary,
    fontFamily: typography.semiBold,
    fontSize: 20,
    textAlign: "center",
  },
  stateDescription: {
    color: colors.textSecondary,
    fontFamily: typography.regular,
    fontSize: 14,
    textAlign: "center",
    lineHeight: 20,
  },
  stateButton: {
    marginTop: spacing.sm,
    minHeight: 44,
    borderRadius: radius.pill,
    paddingHorizontal: spacing.lg,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFFFFF",
  },
  stateButtonText: {
    color: "#000000",
    fontFamily: typography.semiBold,
    fontSize: 14,
  },
  loadingWrap: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: spacing.xl,
    gap: spacing.sm,
  },
  loadingLabel: {
    color: colors.textSecondary,
    fontFamily: typography.regular,
    fontSize: 14,
  },
  skeletonListWrap: {
    gap: spacing.sm,
  },
  skeletonCard: {
    width: "100%",
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.card,
  },
});
