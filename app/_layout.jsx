import { Stack } from "expo-router";
import * as SplashScreen from 'expo-splash-screen';
import { useEffect, useState } from "react";
import { setupDatabase, getSubscriptions } from "../src/db/database";
import { SafeAreaView } from "react-native-safe-area-context";
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { 
  setupNotificationHandler, 
  requestNotificationPermissions, 
  rescheduleAllNotifications 
} from "../src/utils/notifications";



// Keep the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync();

// Setup notification handler globally
setupNotificationHandler();

export default function RootLayout() {
  const [dbReady, setDbReady] = useState(false);

  useEffect(() => {
    async function setup() {
      try {
        await setupDatabase();
        setDbReady(true);

        // Request notification permissions
        const hasPermission = await requestNotificationPermissions();
        
        if (hasPermission) {
          // Reschedule all notifications on app launch
          const subscriptions = await getSubscriptions();
          await rescheduleAllNotifications(subscriptions);
        }
      } catch (e) {
        console.error("Setup error:", e);
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
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaView style={{ flex: 1, backgroundColor: '#050505' }}>
        <Stack
          screenOptions={{
            headerShown: false,
          }}
        />
      </SafeAreaView>
    </GestureHandlerRootView>
  );
}