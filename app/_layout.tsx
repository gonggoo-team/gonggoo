import { Stack } from "expo-router";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { ThemeProvider } from "@/design-system";

export default function RootLayout() {

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <ThemeProvider>
          <Stack>
            <Stack.Screen name="index" />
            <Stack.Screen name="(tabs)" options={{headerShown: false}} />

            <Stack.Screen
              name="search"
              options={{
                headerShown: false,
                presentation: 'card',
                animation: 'slide_from_right',
                contentStyle: { backgroundColor: '#FFFFFF' },
              }}
            />

            <Stack.Screen
              name="search-results"
              options={{
                headerShown: false,
              }}
            />

            <Stack.Screen
              name="filter"
              options={{
                headerShown: false,
              }}
            />

            <Stack.Screen
              name="product/[id]"
              options={{
                headerShown: false,
                presentation: 'card',
              }}
            />

            <Stack.Protected guard={__DEV__}>
              <Stack.Screen name="storybook" options={{presentation: 'modal',
              animation: 'slide_from_right',animationDuration: 2000,
              headerShown: false,}} />
            </Stack.Protected>
          </Stack>
        </ThemeProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
