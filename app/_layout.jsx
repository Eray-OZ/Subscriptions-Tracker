import { Stack } from "expo-router";
import * as SplashScreen from 'expo-splash-screen';
import { useEffect, useState } from "react";
import { setupDatabase } from "./db/database";

// Keep the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [dbReady, setDbReady] = useState(false);

  useEffect(() => {
    async function setup() {
      try {
        console.log("Veritabanı kurulumu başlıyor...");
        await setupDatabase();
        setDbReady(true);
        console.log("Veritabanı başarıyla kuruldu.");
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
      console.log("Splash screen gizlendi.");
    }
  }, [dbReady]);

  if (!dbReady) {
    return null; // or a loading spinner
  }

  return <Stack />;
}
