import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from './screens/LoginScreen';
import HomeScreen from './screens/HomeScreen';
import FilterItem from './screens/FilterItem';

const Stack = createNativeStackNavigator();

export default function App() {
  //
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen 
        options={{ headerShown: false}} 
        name="Login" 
        component={LoginScreen} />
        <Stack.Screen 
        name="Home" 
        options={{ title: 'Startsida' }}
        component={HomeScreen} />
        <Stack.Screen 
        name="FilterItem" 
        options={{ title: 'Filtrera' }}
        component={FilterItem} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
