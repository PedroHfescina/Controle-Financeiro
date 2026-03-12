import React from "react";
import { TouchableOpacity } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";

import HomeScreen from "../screens/HomeScreen";
import AnalysisScreen from "../screens/AnalysisScreen";
import CategoriesScreen from "../screens/CategoriesScreen";
import ProfileScreen from "../screens/ProfileScreen";
import type { RootStackParamList } from "./RootNavigator";

export type TabParamList = {
  Home: undefined;
  Analysis: undefined;
  Add: undefined;
  Categories: undefined;
  Profile: undefined;
};

const Tab = createBottomTabNavigator<TabParamList>();

function EmptyScreen() {
  return null;
}

export default function TabNavigator() {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  return (
    <Tab.Navigator
      initialRouteName="Home"
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: "#1976ff",
        tabBarInactiveTintColor: "#94a3b8",
        tabBarLabelStyle: { fontSize: 11, fontWeight: "600" },

        tabBarStyle: {
          position: "absolute",
          left: 14,
          right: 14,
          bottom: 14,
          height: 70,
          paddingBottom: 10,
          paddingTop: 8,
          borderRadius: 18,
          borderTopWidth: 0,
          backgroundColor: "#fff",
          shadowColor: "#000",
          shadowOpacity: 0.08,
          shadowRadius: 16,
          elevation: 10,
        },

        tabBarIcon: ({ color, focused }) => {
          if (route.name === "Add") return null;

          let iconName: keyof typeof Ionicons.glyphMap = "ellipse";

          if (route.name === "Home") {
            iconName = focused ? "home" : "home-outline";
          }

          if (route.name === "Analysis") {
            iconName = focused ? "stats-chart" : "stats-chart-outline";
          }

          if (route.name === "Categories") {
            iconName = focused ? "grid" : "grid-outline";
          }

          if (route.name === "Profile") {
            iconName = focused ? "person" : "person-outline";
          }

          return <Ionicons name={iconName} size={20} color={color} />;
        },
      })}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{ tabBarLabel: "Home" }}
      />

      <Tab.Screen
        name="Analysis"
        component={AnalysisScreen}
        options={{ tabBarLabel: "Análise" }}
      />

      <Tab.Screen
        name="Add"
        component={EmptyScreen}
        options={{
          tabBarLabel: "",
          tabBarButton: () => (
            <TouchableOpacity
              activeOpacity={0.9}
              onPress={() => navigation.navigate("AddExpense")}
              style={{
                width: 58,
                height: 58,
                borderRadius: 29,
                backgroundColor: "#1976ff",
                alignItems: "center",
                justifyContent: "center",
                marginTop: -26,
                shadowColor: "#1976ff",
                shadowOpacity: 0.25,
                shadowRadius: 16,
                elevation: 12,
              }}
            >
              <Ionicons name="add" size={30} color="#fff" />
            </TouchableOpacity>
          ),
        }}
        listeners={{
          tabPress: (e) => e.preventDefault(),
        }}
      />

      <Tab.Screen
        name="Categories"
        component={CategoriesScreen}
        options={{ tabBarLabel: "Categorias" }}
      />

      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{ tabBarLabel: "Perfil" }}
      />
    </Tab.Navigator>
  );
}