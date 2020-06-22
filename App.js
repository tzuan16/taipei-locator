import React, { useState, useEffect } from 'react';
import { StatusBar, Platform } from "react-native";
import DrawerNavigator from "./src/navigation/DrawerNavigator"
import { NavigationContainer } from '@react-navigation/native';
import AnimatedSplash from "react-native-animated-splash-screen";
import logo from "./assets/images/logo.png";

export default function App() {
  const [appLoaded, setAppLoaded] = useState(false)

  useEffect(() => {
    setAppLoaded(true)
  }, [])

  return (
    <AnimatedSplash
      isLoaded={appLoaded}
      logoImage={logo}
      backgroundColor={"#fff"}
      logoHeight={150}
      logoWidth={150}
    >
      <NavigationContainer>
        <DrawerNavigator />
      </NavigationContainer>
      <StatusBar hidden={Platform.OS !== "ios"} />
    </AnimatedSplash>
  );
}
