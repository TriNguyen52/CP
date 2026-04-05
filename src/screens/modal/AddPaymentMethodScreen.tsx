import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { NavigationProp, ParamListBase, useNavigation } from "@react-navigation/native";

import { AppStatusBar } from "../../components/common/AppStatusBar";
import { CameraTextInput, DateCvvInputRow, IconTextInput } from "../../components/common/FormInputs";
import { NavigationHeader } from "../../components/common/NavigationHeader";
import { ScreenContainer } from "../../components/common/ScreenContainer";
import { spacing, typography } from "../../theme/tokens";

export function AddPaymentMethodScreen() {
  const navigation = useNavigation<NavigationProp<ParamListBase>>();

  return (
    <ScreenContainer contentStyle={styles.content}>
      <AppStatusBar />
      <View style={styles.modalBackdrop}>
        <NavigationHeader title="Add a Payment Method" />

        <View style={styles.form}>
          <CameraTextInput
            icon="card-outline"
            placeholder="Card Number"
            keyboardType="number-pad"
          />
          <DateCvvInputRow />
          <IconTextInput icon="person-outline" placeholder="Full Name" />

          <View style={styles.actionsRow}>
            <Pressable
              style={[styles.actionButton, styles.cancelButton]}
              onPress={() => {
                if (navigation.canGoBack()) {
                  navigation.goBack();
                }
              }}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </Pressable>

            <Pressable style={[styles.actionButton, styles.saveButton]}>
              <Text style={styles.saveButtonText}>Save</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingTop: spacing.sm,
    paddingBottom: 100,
  },
  modalBackdrop: {
    zIndex: 200,
  },
  form: {
    gap: spacing.md,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.2)",
    backgroundColor: "rgba(255,255,255,0.06)",
    padding: spacing.md,
    zIndex: 201,
    marginBottom: 16,
  },
  actionsRow: {
    flexDirection: "row",
    gap: spacing.sm,
  },
  actionButton: {
    flex: 1,
    minHeight: 50,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  cancelButton: {
    backgroundColor: "#2D2D2D",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.2)",
  },
  saveButton: {
    backgroundColor: "#FFFFFF",
  },
  cancelButtonText: {
    color: "#FFFFFF",
    fontFamily: typography.semiBold,
    fontSize: 15,
  },
  saveButtonText: {
    color: "#000000",
    fontFamily: typography.semiBold,
    fontSize: 15,
  },
});
