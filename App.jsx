import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Header from './components/Header';
import HomeScreen from './app/tabs/index';
import RegisterScreen from './app/tabs/register';

const Stack = createStackNavigator();

function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Home"
        screenOptions={{
          header: () => <Header />,
          headerShown: false,
        }}
      >
        <Stack.Screen 
          name="Home" 
          component={HomeScreen} 
        />
        <Stack.Screen 
          name="Register" 
          component={RegisterScreen} 
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App; 