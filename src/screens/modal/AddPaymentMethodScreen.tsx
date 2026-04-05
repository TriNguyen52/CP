import React from "react";
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { NavigationProp, ParamListBase, useNavigation } from "@react-navigation/native";

import { AppStatusBar } from "../../components/common/AppStatusBar";
import { CameraTextInput, DateCvvInputRow, IconTextInput } from "../../components/common/FormInputs";
import { NavigationHeader } from "../../components/common/NavigationHeader";
import { spacing, typography } from "../../theme/tokens";

export function AddPaymentMethodScreen() {
  const navigation = useNavigation<NavigationProp<ParamListBase>>();

  return (
    <KeyboardAvoidingView
      style={styles.root}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={8}
    >
      <SafeAreaView style={styles.safeArea}>
        <AppStatusBar />
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
        >
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
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>

      <View style={styles.fixedActionsWrap}>
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
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: "#000000",
  },
  safeArea: {
    flex: 1,
    backgroundColor: "#000000",
  },
  scroll: {
    flex: 1,
    backgroundColor: "#000000",
  },
  content: {
    paddingTop: spacing.sm,
    paddingHorizontal: spacing.md,
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
  fixedActionsWrap: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#000000",
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: "rgba(255, 255, 255, 0.1)",
  },
  actionsRow: {
    flexDirection: "row",
    gap: 12,
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
