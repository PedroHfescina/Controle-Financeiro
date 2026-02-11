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
          tabBarInactiveTintColor: '#999',
          tabBarStyle: {
            height: 65,
            paddingBottom: 8,
          },
          tabBarIcon: ({ color, size }) => {
            let iconName: keyof typeof Ionicons.glyphMap;

            switch (route.name) {
              case 'Home':
                iconName = 'home-outline';
                break;
              case 'AddExpense':
                iconName = 'add-circle-outline';
                break;
              case 'Settings':
                iconName = 'settings-outline';
                break;
              case 'Profile':
                iconName = 'person-outline';
                break;
              default:
                iconName = 'ellipse';
            }

            return <Ionicons name={iconName} size={size} color={color} />;
          },
        })}
      >
        <Tab.Screen
          name="Home"
          component={Home}
          options={{ title: 'Início' }}
        />

        <Tab.Screen
          name="AddExpense"
          component={AddExpense}
          options={{ title: 'Adicionar' }}
        />

        <Tab.Screen
          name="Settings"
          component={Settings}
          options={{ title: 'Configurações' }}
        />

        <Tab.Screen
          name="Profile"
          component={Profile}
          options={{ title: 'Usuário' }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
