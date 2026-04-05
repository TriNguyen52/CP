import React from "react";
import { View, StyleSheet } from "react-native";

import { AppStatusBar } from "../../components/common/AppStatusBar";
import { CameraTextInput, DateCvvInputRow, IconTextInput } from "../../components/common/FormInputs";
import { NavigationHeader } from "../../components/common/NavigationHeader";
import { PrimaryButton } from "../../components/common/Buttons";
import { ScreenContainer } from "../../components/common/ScreenContainer";
import { spacing } from "../../theme/tokens";

export function AddPaymentMethodScreen() {
  return (
    <ScreenContainer contentStyle={styles.content}>
      <AppStatusBar />
      <NavigationHeader title="Add a Payment Method" />

      <View style={styles.form}>
        <CameraTextInput
          icon="card-outline"
          placeholder="Card Number"
          keyboardType="number-pad"
        />
        <DateCvvInputRow />
        <IconTextInput icon="person-outline" placeholder="Full Name" />

        <PrimaryButton label="Save Payment Method" />
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingTop: spacing.sm,
    paddingBottom: spacing.xl,
  },
  form: {
    gap: spacing.md,
  },
});
