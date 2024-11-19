import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Header from './components/Header';
import HomeScreen from './app/tabs/index';
import RegisterScreen from './app/tabs/register';
import CompraScreen from './app/tabs/compra';
import CarritoScreen from './app/tabs/carrito';
import LoginScreen from './app/tabs/login';
const Stack = createStackNavigator();

function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="login"
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen 
          name="login" 
          component={LoginScreen}
          options={{
            headerShown: false
          }}
        />
        <Stack.Screen 
          name="index" 
          component={HomeScreen}
          options={{
            header: () => <Header />
          }}
        />
        <Stack.Screen 
          name="Register" 
          component={RegisterScreen}
          options={{
            header: () => <Header />
          }}
        />
        <Stack.Screen 
          name="Compra" 
          component={CompraScreen}
          options={{
            header: () => <Header />
          }}
        />
        <Stack.Screen 
          name="Carrito" 
          component={CarritoScreen}
          options={{
            header: () => <Header />
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App; 