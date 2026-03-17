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
  const { loading: financeLoading, plan } = useFinance();

  const isAuthenticated = !!user;
  const setupCompleted = !!plan?.setupCompleted;

  let navigationStateKey = "guest";

  if (authLoading) {
    navigationStateKey = "auth-loading";
  } else if (!isAuthenticated) {
    navigationStateKey = "guest";
  } else if (financeLoading) {
    navigationStateKey = "finance-loading";
  } else if (!setupCompleted) {
    navigationStateKey = "auth-setup";
  } else {
    navigationStateKey = "auth-ready";
  }

  return (
    <NavigationContainer>
      <Stack.Navigator
        key={navigationStateKey}
        screenOptions={{ headerShown: false }}
      >
        {authLoading ? (
          <Stack.Screen name="Login" component={AppLoadingScreen} />
        ) : !isAuthenticated ? (
          <>
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Register" component={RegisterScreen} />
          </>
        ) : financeLoading ? (
          <Stack.Screen name="Setup" component={AppLoadingScreen} />
        ) : !setupCompleted ? (
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