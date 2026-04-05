import React, { useMemo, useState } from "react";
import { Pressable, StyleSheet, Switch, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { ScreenContainer } from "../../components/common/ScreenContainer";
import { colors, radius, spacing, typography } from "../../theme/tokens";

type DropdownField = "currency" | "language";

const currencyOptions = ["USD", "EUR", "GBP"] as const;
const languageOptions = ["English", "Spanish", "French"] as const;

export function PreferencesScreen() {
  const [currency, setCurrency] = useState<(typeof currencyOptions)[number]>("USD");
  const [language, setLanguage] = useState<(typeof languageOptions)[number]>("English");
  const [pushEnabled, setPushEnabled] = useState(true);
  const [emailEnabled, setEmailEnabled] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<DropdownField | null>(null);

  const activeOptions = useMemo(() => {
    if (openDropdown === "currency") {
      return currencyOptions;
    }

    if (openDropdown === "language") {
      return languageOptions;
    }

    return [];
  }, [openDropdown]);

  return (
    <ScreenContainer contentStyle={styles.content}>
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Preferences</Text>

        <View style={styles.rowBlock}>
          <Text style={styles.rowLabel}>Currency</Text>
          <Pressable
            style={styles.dropdownButton}
            onPress={() => setOpenDropdown((prev) => (prev === "currency" ? null : "currency"))}
          >
            <Text style={styles.dropdownValue}>{currency}</Text>
            <Ionicons
              name={openDropdown === "currency" ? "chevron-up" : "chevron-down"}
              size={16}
              color={colors.textPrimary}
            />
          </Pressable>
        </View>

        <View style={styles.rowBlock}>
          <Text style={styles.rowLabel}>Language</Text>
          <Pressable
            style={styles.dropdownButton}
            onPress={() => setOpenDropdown((prev) => (prev === "language" ? null : "language"))}
          >
            <Text style={styles.dropdownValue}>{language}</Text>
            <Ionicons
              name={openDropdown === "language" ? "chevron-up" : "chevron-down"}
              size={16}
              color={colors.textPrimary}
            />
          </Pressable>
        </View>

        {openDropdown ? (
          <View style={styles.dropdownMenu}>
            {activeOptions.map((option) => (
              <Pressable
                key={option}
                style={styles.dropdownOption}
                onPress={() => {
                  if (openDropdown === "currency") {
                    setCurrency(option as (typeof currencyOptions)[number]);
                  } else {
                    setLanguage(option as (typeof languageOptions)[number]);
                  }
                  setOpenDropdown(null);
                }}
              >
                <Text style={styles.dropdownOptionText}>{option}</Text>
              </Pressable>
            ))}
          </View>
        ) : null}

        <View style={styles.switchRow}>
          <Text style={styles.rowLabel}>Push Notifications</Text>
          <Switch
            value={pushEnabled}
            onValueChange={setPushEnabled}
            thumbColor={pushEnabled ? "#3B82F6" : "#B4B4B4"}
            trackColor={{ false: "#2D2D2D", true: "rgba(59,130,246,0.45)" }}
          />
        </View>

        <View style={styles.switchRow}>
          <Text style={styles.rowLabel}>Email Notifications</Text>
          <Switch
            value={emailEnabled}
            onValueChange={setEmailEnabled}
            thumbColor={emailEnabled ? "#3B82F6" : "#B4B4B4"}
            trackColor={{ false: "#2D2D2D", true: "rgba(59,130,246,0.45)" }}
          />
        </View>
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingTop: spacing.sm,
    paddingBottom: 116,
    gap: spacing.md,
  },
  card: {
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: "#1F1F1F",
    padding: spacing.md,
    gap: spacing.sm,
  },
  sectionTitle: {
    color: colors.textPrimary,
    fontFamily: typography.semiBold,
    fontSize: 18,
  },
  rowBlock: {
    gap: 6,
  },
  rowLabel: {
    color: colors.textPrimary,
    fontFamily: typography.regular,
    fontSize: 14,
  },
  dropdownButton: {
    minHeight: 44,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.2)",
    backgroundColor: "#1F1F1F",
    paddingHorizontal: spacing.sm,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  dropdownValue: {
    color: colors.textPrimary,
    fontFamily: typography.regular,
    fontSize: 14,
  },
  dropdownMenu: {
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.2)",
    backgroundColor: "#1F1F1F",
    overflow: "hidden",
  },
  dropdownOption: {
    minHeight: 42,
    justifyContent: "center",
    paddingHorizontal: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255,255,255,0.12)",
  },
  dropdownOptionText: {
    color: colors.textPrimary,
    fontFamily: typography.regular,
    fontSize: 14,
  },
  switchRow: {
    minHeight: 50,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.2)",
    backgroundColor: "#1F1F1F",
    paddingHorizontal: spacing.sm,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
});
