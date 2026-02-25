import React from 'react';
import { FinanceProvider } from './src/context/FinanceContext';
import RootNavigator from './src/navigation/RootNavigator';

export default function App() {
  return (
    <FinanceProvider>
      <RootNavigator />
    </FinanceProvider>
  );
}