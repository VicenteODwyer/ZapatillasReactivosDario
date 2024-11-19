import { Stack } from 'expo-router';

export default function TabLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="register" />
      <Stack.Screen name="compra" />
      <Stack.Screen name="carrito" />
      <Stack.Screen name="infoCompra" />
    </Stack>
  );
}
