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

const App = () => {
  return (
    <Provider store={store}>
      <StatusBar
        style="dark"
      />

      <RootNavigator />
    </Provider>
  );
};

export default App;
