import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import BottomTabs from "./src/navigation/BottomTab";
import SplashScreen from "./src/SplashScreen";
import OnBoardingScreen from "./src/auth/OnBoardingScren";
import RegisterScreen from "./src/auth/RegisterScreen";
import LoginScreen from "./src/auth/LoginScreen";
import OTPVerifyScreen from "./src/auth/OTPVerify";
import NotificationScreen from "./src/NotificationScreen";

const Stack = createNativeStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Splash"
        screenOptions={{ 
          headerShown: false,
          gestureEnabled:false
         }}
      >
        <Stack.Screen name="Splash" component={SplashScreen} />
        <Stack.Screen name="Onboarding" component={OnBoardingScreen} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Register" component={RegisterScreen} />
        <Stack.Screen name="OTPVerify" component={OTPVerifyScreen} />
        <Stack.Screen name="Notifications" component={NotificationScreen} />
        <Stack.Screen name="Main" component={BottomTabs} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;