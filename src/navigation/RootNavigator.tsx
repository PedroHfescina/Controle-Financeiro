import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import SetupScreen from "../screens/SetupScreen";
import TabNavigator from "./TabNavigator";
import AddExpenseScreen from "../screens/AddExpenseScreen";

export type RootStackParamList = {
  Setup: undefined;
  HomeTabs: undefined;
  AddExpense: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function RootNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Setup"
        screenOptions={{ headerShown: false }}
      >
        <Stack.Screen name="Setup" component={SetupScreen} />
        <Stack.Screen name="HomeTabs" component={TabNavigator} />

        {/* abre por cima das tabs */}
        <Stack.Screen name="AddExpense" component={AddExpenseScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}