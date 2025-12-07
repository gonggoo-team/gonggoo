import { Stack } from "expo-router";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";

import { ThemeProvider } from "@/design-system";
import { AuthProvider } from "@/app/shared/contexts";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";

export default function RootLayout() {

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <ThemeProvider>
          <AuthProvider>
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

              <Stack.Protected guard={__DEV__}>
                <Stack.Screen name="storybook" options={{presentation: 'modal',
                animation: 'slide_from_right',animationDuration: 2000,
                headerShown: false,}} />
              </Stack.Protected>
            </Stack>
            </BottomSheetModalProvider>
          </AuthProvider>
        </ThemeProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
