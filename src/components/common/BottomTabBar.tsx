import React from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";

import { colors, radius, spacing, typography } from "../../theme/tokens";
import { FloatingActionButton } from "./Buttons";

type TabIconName = {
  active: keyof typeof Ionicons.glyphMap;
  inactive: keyof typeof Ionicons.glyphMap;
  label: string;
};

const tabMeta: Record<string, TabIconName> = {
  Home: {
    active: "home",
    inactive: "home-outline",
    label: "Home",
  },
  Transactions: {
    active: "swap-horizontal",
    inactive: "swap-horizontal-outline",
    label: "Transactions",
  },
  Profile: {
    active: "person",
    inactive: "person-outline",
    label: "Profile",
  },
};

type AppBottomTabBarProps = BottomTabBarProps & {
  showCenterButton?: boolean;
  onCenterPress?: () => void;
};

export function BottomTabBar({
  state,
  descriptors,
  navigation,
  showCenterButton,
  onCenterPress,
}: AppBottomTabBarProps) {
  return (
    <View style={styles.wrapper}>
      <View style={styles.container}>
        {state.routes.map((route, index) => {
          const isFocused = state.index === index;
          const meta = tabMeta[route.name];

          const onPress = () => {
            const event = navigation.emit({
              type: "tabPress",
              target: route.key,
              canPreventDefault: true,
            });

            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name);
            }
          };

          const onLongPress = () => {
            navigation.emit({
              type: "tabLongPress",
              target: route.key,
            });
          };

          return (
            <Pressable
              key={route.key}
              accessibilityState={isFocused ? { selected: true } : {}}
              accessibilityLabel={descriptors[route.key].options.tabBarAccessibilityLabel}
              testID={descriptors[route.key].options.tabBarButtonTestID}
              onPress={onPress}
              onLongPress={onLongPress}
              style={styles.tabButton}
            >
              <Ionicons
                name={isFocused ? meta.active : meta.inactive}
                size={22}
                color={isFocused ? colors.textPrimary : colors.textSecondary}
              />
              <Text style={[styles.tabLabel, isFocused && styles.tabLabelActive]}>
                {meta.label}
              </Text>
            </Pressable>
          );
        })}
      </View>
      {showCenterButton ? (
        <View style={styles.centerButtonWrap}>
          <FloatingActionButton label="Edit\nProfile" onPress={onCenterPress} />
        </View>
      ) : null}
      <View style={styles.gestureIndicator} />
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    paddingTop: spacing.sm,
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.md,
    backgroundColor: colors.background,
  },
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.pill,
    minHeight: 66,
    paddingHorizontal: spacing.md,
  },
  tabButton: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 2,
    paddingVertical: spacing.xs,
  },
  tabLabel: {
    color: colors.textSecondary,
    fontFamily: typography.regular,
    fontSize: 12,
  },
  tabLabelActive: {
    color: colors.textPrimary,
    fontFamily: typography.semiBold,
  },
  centerButtonWrap: {
    position: "absolute",
    alignSelf: "center",
    bottom: 26,
  },
  gestureIndicator: {
    alignSelf: "center",
    marginTop: spacing.sm,
    width: 132,
    height: 5,
    borderRadius: radius.full,
    backgroundColor: colors.textMuted,
  },
});
