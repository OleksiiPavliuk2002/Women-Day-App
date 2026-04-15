import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { StatusBar } from "expo-status-bar";
import React, { useEffect } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";
import { initDB } from "./src/database/db";
import HomeScreen from "./src/screens/HomeScreen";
import WishCardScreen from "./src/screens/WishCardScreen";

const Stack = createStackNavigator();

export default function App() {
  useEffect(() => {
    initDB().catch(console.error);
  }, []);

  return (
    <SafeAreaView style={{ flex: 1 }} edges={["bottom"]}>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <NavigationContainer>
          <StatusBar style="light" />
          <Stack.Navigator
            initialRouteName="Home"
            screenOptions={{ headerShown: false, gestureEnabled: false }}
          >
            <Stack.Screen name="Home" component={HomeScreen} />
            <Stack.Screen name="WishCard" component={WishCardScreen} />
          </Stack.Navigator>
        </NavigationContainer>
      </GestureHandlerRootView>
    </SafeAreaView>
  );
}
