import React from "react";
import { ActivityIndicator, View } from "react-native";
import {
  NavigationContainer,
  NavigatorScreenParams,
} from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import SetupScreen from "../screens/SetupScreen";
import AddExpenseScreen from "../screens/AddExpenseScreen";
import ExpensesHistoryScreen from "../screens/ExpensesHistoryScreen";
import TabNavigator, { TabParamList } from "./TabNavigator";

import LoginScreen from "../screens/LoginScreen";
import RegisterScreen from "../screens/RegisterScreen";
import { useAuth } from "../context/AuthContext";
import { useFinance } from "../context/FinanceContext";

export type RootStackParamList = {
  Login: undefined;
  Register: undefined;
  Setup: undefined;
  HomeTabs: NavigatorScreenParams<TabParamList> | undefined;
  AddExpense: undefined;
  ExpensesHistory: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

function AppLoadingScreen() {
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: "#f5f6f8",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <ActivityIndicator size="large" color="#2563eb" />
    </View>
  );
}

export default function RootNavigator() {
  const { user, loading: authLoading } = useAuth();
  const {
    loading: financeLoading,
    isPlanReady,
    plan,
  } = useFinance();

  const isAuthenticated = !!user;
  const isFinanceBootstrapping =
    isAuthenticated && (financeLoading || !isPlanReady);

  if (authLoading || isFinanceBootstrapping) {
    return <AppLoadingScreen />;
  }

  const hasCompletedSetup = Boolean(plan?.setupCompleted);

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {!isAuthenticated ? (
          <>
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Register" component={RegisterScreen} />
          </>
        ) : !hasCompletedSetup ? (
          <>
            <Stack.Screen name="Setup" component={SetupScreen} />
            <Stack.Screen name="HomeTabs" component={TabNavigator} />
            <Stack.Screen name="AddExpense" component={AddExpenseScreen} />
            <Stack.Screen
              name="ExpensesHistory"
              component={ExpensesHistoryScreen}
            />
          </>
        ) : (
          <>
            <Stack.Screen name="HomeTabs" component={TabNavigator} />
            <Stack.Screen name="Setup" component={SetupScreen} />
            <Stack.Screen name="AddExpense" component={AddExpenseScreen} />
            <Stack.Screen
              name="ExpensesHistory"
              component={ExpensesHistoryScreen}
            />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}