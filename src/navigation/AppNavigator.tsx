import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';

import Home from '../screens/Home';
import AddExpense from '../screens/AddExpense';
import Settings from '../screens/Settings';
import Profile from '../screens/Profile';

const Tab = createBottomTabNavigator();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          headerShown: false,
          tabBarActiveTintColor: '#1E88E5',
          tabBarIcon: ({ color, size }) => {
            let iconName: any;

            if (route.name === 'Home') iconName = 'home';
            if (route.name === 'AddExpense') iconName = 'add-circle';
            if (route.name === 'Settings') iconName = 'settings';
            if (route.name === 'Profile') iconName = 'person';

            return <Ionicons name={iconName} size={size} color={color} />;
          },
        })}
      >
        <Tab.Screen name="Home" component={Home} />
        <Tab.Screen name="AddExpense" component={AddExpense} options={{ title: 'Adicionar' }} />
        <Tab.Screen name="Settings" component={Settings} options={{ title: 'Configurações' }} />
        <Tab.Screen name="Profile" component={Profile} options={{ title: 'Usuário' }} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
