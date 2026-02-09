import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import Home from '../screens/Home';
import AddExpense from '../screens/AddExpense';
import Settings from '../screens/Settings';

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="Home"
          component={Home}
          options={{ title: 'Controle de Gastos' }}
        />

        <Stack.Screen
          name="AddExpense"
          component={AddExpense}
          options={{ title: 'Adicionar Gasto' }}
        />

        <Stack.Screen
          name="Settings"
          component={Settings}
          options={{ title: 'Configurações' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
