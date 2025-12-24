import { Stack } from "expo-router";
import { StatusBar } from "react-native";
import "./globals.css";

export default function RootLayout() {
  return (
    <>
      // to remove the phone status bar(battery, time, etc)
      <StatusBar hidden={true} />
      <Stack>
        <Stack.Screen 
          name="(tabs)"
          options = {{ headerShown: false }}
        />
        <Stack.Screen 
          name="movies/[id]"
          options = {{ headerShown: false }}
        />
    </Stack>
    </>
  
)}
