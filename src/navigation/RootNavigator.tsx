import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import SetupScreen from "../screens/SetupScreen";
import AddExpenseScreen from "../screens/AddExpenseScreen";
import TabNavigator from "./TabNavigator";

import LoginScreen from "../screens/LoginScreen";
import RegisterScreen from "../screens/RegisterScreen";
import { useAuth } from "../context/AuthContext";

export type RootStackParamList = {
  Login: undefined;
  Register: undefined;

  Setup: undefined;
  HomeTabs: undefined;
  AddExpense: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function RootNavigator() {
  const { user, loading } = useAuth();

  if (loading) return null;

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {!user ? (
          <>
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Register" component={RegisterScreen} />
          </>
        ) : (
          <>
            <Stack.Screen name="Setup" component={SetupScreen} />
            <Stack.Screen name="HomeTabs" component={TabNavigator} />
            <Stack.Screen name="AddExpense" component={AddExpenseScreen} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}