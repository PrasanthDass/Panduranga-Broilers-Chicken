import { RelativePathString, Stack, router, useSegments } from "expo-router";

function AppLayoutNav() {
  return (
    <Stack>
      <Stack.Screen name="(admin)" options={{ headerShown: false }} />
      <Stack.Screen name="(customer)" options={{ headerShown: false }} />
    </Stack>
  );
}

export default function RootLayout() {
  return <AppLayoutNav />;
}
