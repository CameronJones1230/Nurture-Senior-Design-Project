import React, { useState, useEffect, useRef } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SensorProvider } from './utils/SensorContext';
import LoginScreen from './screens/LoginScreen';
import HomeScreen from './screens/HomeScreen';
import CreateAccountScreen from './screens/CreateAccountScreen';
import PlantDetailScreen from './screens/PlantDetailScreen';
import CreatePlantScreen from './screens/CreatePlantScreen';
import SettingsScreen from './screens/SettingsScreen';
import * as Font from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { UserProvider } from './utils/UserContext';

const Stack = createNativeStackNavigator();

const WrappedPlantDetailScreen = ({ navigation, route }) => (
  <SensorProvider>
    <PlantDetailScreen navigation={navigation} route={route} />
  </SensorProvider>
);

export default function App() {
  const [fontsLoaded, setFontsLoaded] = useState(false);
  const navigationRef = useRef(null);

  useEffect(() => {
    const loadResources = async () => {
      try {
        await SplashScreen.preventAutoHideAsync();

        await Font.loadAsync({
          'Montserrat_Regular': require('./fonts/static/Montserrat-Regular.ttf'),
          'Montserrat_Medium': require('./fonts/static/Montserrat-Medium.ttf'),
          'Montserrat_SemiBold': require('./fonts/static/Montserrat-SemiBold.ttf'),
          'Montserrat_Thin': require('./fonts/static/Montserrat-Thin.ttf'),
          'Montserrat_Light': require('./fonts/static/Montserrat-Light.ttf'),
          'Montserrat_Bold': require('./fonts/static/Montserrat-Bold.ttf'),
        });

        setFontsLoaded(true);
      } catch (error) {
        console.error('Error loading app resources:', error);
      } finally {
        await SplashScreen.hideAsync();
      }
    };

    loadResources();
  }, []);

  if (!fontsLoaded) {
    return null; // Or a fallback UI
  }

  return (
    <UserProvider>
      <NavigationContainer ref={navigationRef}>
        <Stack.Navigator
          screenOptions={{
            headerShown: true,
          }}
          initialRouteName="Login"
        >
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen name="PlantDetail" component={WrappedPlantDetailScreen} />
          <Stack.Screen name="Create Plant" component={CreatePlantScreen} />
          <Stack.Screen name="Settings" component={SettingsScreen} />
          <Stack.Screen name="Create Account" component={CreateAccountScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </UserProvider>
  );
}
