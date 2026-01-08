import { SplashScreen, Stack } from "expo-router";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";

import { ThemeProvider } from "@/design-system";
import { AuthProvider, ChatProvider } from "@/app/shared/contexts";
import { useCallback, useEffect, useState } from "react";
import { View } from "react-native";
import { Splash } from "./splash";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [appIsReady, setAppIsReady] = useState(false);

  useEffect(() => {
    async function prepare() {
      try {
        await new Promise(resolve => setTimeout(resolve, 2000));        
      } catch (e) {
        console.warn(e);
      } finally {
        setAppIsReady(true);
      }
    }

    prepare();
  }, []);

  const onLayoutRootView = useCallback(async () => {
    if (appIsReady) {
      await SplashScreen.hideAsync();
    }
  }, [appIsReady]);

  if (!appIsReady) {
    return (
      <View style={{ flex: 1 }}>
        <Splash />
      </View>
    );
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }} onLayout={onLayoutRootView}>
      <SafeAreaProvider>
        <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }} edges={['bottom', 'left', 'right']}>
          <ThemeProvider>
            <AuthProvider>
              <ChatProvider>
                <BottomSheetModalProvider>
                <Stack>
                <Stack.Screen name="index" options={{ headerShown: false }} />
                <Stack.Screen name="(tabs)" options={{ headerShown: false, gestureEnabled: false }} />

                {/* Auth Screens */}
                <Stack.Screen
                  name="splash"
                  options={{
                    headerShown: false,
                    gestureEnabled: false,
                  }}
                />
                <Stack.Screen
                  name="onboarding"
                  options={{
                    headerShown: false,
                    gestureEnabled: false,
                  }}
                />
                <Stack.Screen
                  name="signup"
                  options={{
                    headerShown: false,
                    presentation: 'card',
                    animation: 'slide_from_right',
                  }}
                />
                <Stack.Screen
                  name="login"
                  options={{
                    headerShown: false,
                    presentation: 'card',
                    animation: 'slide_from_right',
                  }}
                />
                <Stack.Screen
                  name="set-location"
                  options={{
                    headerShown: false,
                    presentation: 'card',
                    animation: 'slide_from_right',
                  }}
                />
                <Stack.Screen
                  name="search-location"
                  options={{
                    headerShown: false,
                    presentation: 'card',
                    animation: 'slide_from_right',
                  }}
                />

              <Stack.Screen
                name="search"
                options={{
                  headerShown: false,
                  presentation: 'card',
                  animation: 'slide_from_right',
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
                name="chat/[id]"
                options={{
                  headerShown: false,
                }}
              />

              <Stack.Screen
                name="product-registration"
                options={{
                  headerShown: false,
                  gestureEnabled: false,
                }}
              />
              <Stack.Screen
                name="product-edit/[id]"
                options={{
                  headerShown: false,
                  gestureEnabled: false,
                }}
              />
              <Stack.Screen
                name="product/[id]"
                options={{
                  headerShown: false,
                  presentation: 'card',
                }}
              />

              <Stack.Screen
                name="map-search"
                options={{
                  headerShown: false,                
                }}
              />
              
              <Stack.Screen
                name="neighborhood-search"
                options={{
                  headerShown: false,                
                }}
              />

              <Stack.Screen
                name="location-setting"
                options={{
                  headerShown: false,                
                }}
              />

              <Stack.Screen
                name="neighborhood-setting"
                options={{
                  headerShown: false,                
                }}
              />

              <Stack.Screen
                name="my-info"
                options={{
                  headerShown: false,
                }}
              />

              <Stack.Screen
                name="account-deletion"
                options={{
                  headerShown: false,
                }}
              />

              <Stack.Screen
                name="profile-edit"
                options={{
                  headerShown: false,
                }}
              />

              <Stack.Screen
                name="recent-products"
                options={{
                  headerShown: false,
                }}
              />

              <Stack.Screen
                name="cancel-history"
                options={{
                  headerShown: false,
                }}
              />

              <Stack.Screen
                name="profile/recruiting-list"
                options={{
                  headerShown: false,
                }}
              />

              <Stack.Screen
                name="profile/recruitment-complete-list"
                options={{
                  headerShown: false,
                }}
              />

              <Stack.Screen
                name="profile/group-complete-list"
                options={{
                  headerShown: false,
                }}
              />


              <Stack.Screen
                name="profile/wishlist"
                options={{
                  headerShown: false,
                }}
              />

              <Stack.Screen
                name="profile/joined-list"
                options={{
                  headerShown: false,
                }}
              />

              <Stack.Screen
                name="profile/transaction-complete-list"
                options={{
                  headerShown: false,
                }}
              />

                {/* Storybook - Development Only */}
                {__DEV__ && (
                  <Stack.Screen
                    name="storybook"
                    options={{
                      presentation: 'modal',
                      animation: 'slide_from_right',
                      animationDuration: 2000,
                      headerShown: false,
                    }}
                  />
                )}
              </Stack>
                </BottomSheetModalProvider>
              </ChatProvider>
            </AuthProvider>
          </ThemeProvider>
        </SafeAreaView>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
