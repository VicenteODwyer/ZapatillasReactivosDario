import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Header from './components/Header';
import HomeScreen from './app/tabs/index';
import RegisterScreen from './app/tabs/register';
import CompraScreen from './app/tabs/compra';
import CarritoScreen from './app/tabs/carrito';
import InfoCompraScreen from './app/tabs/infoCompra';

const Stack = createStackNavigator();

function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Home"
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen 
          name="Home" 
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
        <Stack.Screen 
          name="infoCompra" 
          component={InfoCompraScreen}
          options={{
            header: () => <Header />
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App; 