import { Stack } from "expo-router";
import * as SplashScreen from 'expo-splash-screen';
import { useEffect, useState } from "react";
import { setupDatabase } from "./db/database";
import { SafeAreaView } from "react-native-safe-area-context";

// Keep the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [dbReady, setDbReady] = useState(false);

  useEffect(() => {
    async function setup() {
      try {
        await setupDatabase();
        setDbReady(true);
      } catch (e) {
        console.error("Veritabanı kurulumunda hata:", e);
      }
    }
    setup();
  }, []);

  useEffect(() => {
    if (dbReady) {
      // Hide the splash screen after the database is ready
      SplashScreen.hideAsync();
    }
  }, [dbReady]);

  if (!dbReady) {
    return null; // or a loading spinner
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#0D0C1D' }}>
      <Stack
        screenOptions={{
          headerShown: false,
        }}
      />
    </SafeAreaView>
  );
}