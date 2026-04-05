import React from "react";
import { ActivityIndicator, View, StyleSheet } from "react-native";
import { Inter_400Regular, Inter_600SemiBold, useFonts } from "@expo-google-fonts/inter";

import { RootNavigator } from "./src/navigation/RootNavigator";
import { colors } from "./src/theme/tokens";

export default function App() {
  const [loaded] = useFonts({
    Inter_400Regular,
    Inter_600SemiBold,
  });

  if (!loaded) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator color={colors.textPrimary} />
      </View>
    );
  }

  return <RootNavigator />;
}

const styles = StyleSheet.create({
  loader: {
    flex: 1,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
