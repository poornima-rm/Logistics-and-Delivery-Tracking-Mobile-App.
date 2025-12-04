import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Icon from 'react-native-vector-icons/Ionicons';

import CustomerHomeScreen from '../screens/customer/CustomerHomeScreen';
import CreateOrderScreen from '../screens/customer/CreateOrderScreen';
import PaymentScreen from '../screens/customer/PaymentScreen';
import PaymentSuccessScreen from '../screens/customer/PaymentSuccessScreen';
import PaymentFailedScreen from '../screens/customer/PaymentFailedScreen';
import OrdersListScreen from '../screens/customer/OrdersListScreen';
import OrderDetailScreen from '../screens/customer/OrderDetailScreen';
import CustomerProfileScreen from '../screens/customer/CustomerProfileScreen';
import colors from '../constants/colors';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

const HomeStack = () => (
  <Stack.Navigator>
    <Stack.Screen 
      name="HomeMain" 
      component={CustomerHomeScreen}
      options={{ headerShown: false }}
    />
    <Stack.Screen 
      name="CreateOrder" 
      component={CreateOrderScreen}
      options={{ title: 'Create Order' }}
    />
    <Stack.Screen 
      name="Payment" 
      component={PaymentScreen}
      options={{ title: 'Payment' }}
    />
    <Stack.Screen 
      name="PaymentSuccess" 
      component={PaymentSuccessScreen}
      options={{ headerShown: false }}
    />
    <Stack.Screen 
      name="PaymentFailed" 
      component={PaymentFailedScreen}
      options={{ headerShown: false }}
    />
  </Stack.Navigator>
);

const OrdersStack = () => (
  <Stack.Navigator>
    <Stack.Screen 
      name="OrdersList" 
      component={OrdersListScreen}
      options={{ title: 'My Orders' }}
    />
    <Stack.Screen 
      name="OrderDetail" 
      component={OrderDetailScreen}
      options={{ title: 'Order Details' }}
    />
  </Stack.Navigator>
);

const CustomerNavigator = () => {
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
        name="Home"
        component={HomeStack}
        options={{
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <Icon name="home-outline" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Orders"
        component={OrdersStack}
        options={{
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <Icon name="list-outline" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Profile"
        component={CustomerProfileScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Icon name="person-outline" size={size} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

export default CustomerNavigator;
