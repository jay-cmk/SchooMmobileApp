import { ScreenContent } from 'components/ScreenContent';

import './global.css';
import React from "react";

import {
  Provider,
} from "react-redux";

import {
  StatusBar,
} from "expo-status-bar";

import {
  store,
} from "./src/store/store";

import RootNavigator from "./src/navigation/RootNavigator";

import {
  SafeAreaProvider,
} from "react-native-safe-area-context";

const App = () => {
  return (
    <Provider store={store}>
       <SafeAreaProvider>
        <StatusBar style="dark" />

        <RootNavigator />
      </SafeAreaProvider>
    </Provider>
  );
};

export default App;
