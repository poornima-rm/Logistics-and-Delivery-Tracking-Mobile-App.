import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Icon from 'react-native-vector-icons/Ionicons';

import DriverDashboardScreen from '../screens/driver/DriverDashboardScreen';
import DeliveryDetailScreen from '../screens/driver/DeliveryDetailScreen';
import DriverHistoryScreen from '../screens/driver/DriverHistoryScreen';
import DriverProfileScreen from '../screens/driver/DriverProfileScreen';
import colors from '../constants/colors';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

const DeliveriesStack = () => (
  <Stack.Navigator>
    <Stack.Screen 
      name="DeliveriesList" 
      component={DriverDashboardScreen}
      options={{ title: 'My Deliveries' }}
    />
    <Stack.Screen 
      name="DeliveryDetail" 
      component={DeliveryDetailScreen}
      options={{ title: 'Delivery Details' }}
    />
  </Stack.Navigator>
);

const DriverNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.gray[400],
        tabBarStyle: {
          backgroundColor: colors.white,
          borderTopColor: colors.border,
        },
      }}>
      <Tab.Screen
        name="Deliveries"
        component={DeliveriesStack}
        options={{
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <Icon name="car-outline" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="History"
        component={DriverHistoryScreen}
        options={{
          title: 'Delivery History',
          tabBarIcon: ({ color, size }) => (
            <Icon name="time-outline" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Profile"
        component={DriverProfileScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Icon name="person-outline" size={size} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

export default DriverNavigator;
