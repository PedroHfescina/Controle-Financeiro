import React from "react";
import RootNavigator from "./src/navigation/RootNavigator";
import { FinanceProvider } from "./src/context/FinanceContext";
import { AuthProvider } from "./src/context/AuthContext";

export default function App() {
  return (
    <AuthProvider>
      <FinanceProvider>
        <RootNavigator />
      </FinanceProvider>
    </AuthProvider>
  );
}