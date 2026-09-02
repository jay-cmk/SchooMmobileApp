import React from "react";

import {
  NavigationContainer,
} from "@react-navigation/native";

import {
  createNativeStackNavigator,
} from "@react-navigation/native-stack";

import SplashScreen from "../screens/splash/SplashScreen";
import LoginScreen from "../screens/auth/LoginScreen";

import StudentNavigator from "./StudentNavigator";
import { RootStackParamList } from "types/navigation.types";



const Stack =
  createNativeStackNavigator<RootStackParamList>();

const RootNavigator =
  () => {
    return (
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="Splash"
          screenOptions={{
            headerShown: false,
            animation: "fade",
          }}
        >
          <Stack.Screen
            name="Splash"
            component={
              SplashScreen
            }
          />

          <Stack.Screen
            name="Login"
            component={
              LoginScreen
            }
          />

          <Stack.Screen
            name="StudentApp"
            component={
              StudentNavigator
            }
          />
        </Stack.Navigator>
      </NavigationContainer>
    );
  };

export default RootNavigator;