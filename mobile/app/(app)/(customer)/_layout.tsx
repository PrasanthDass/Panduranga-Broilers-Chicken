import { useAuth } from "@/context/AuthContext";
import { router, Stack } from "expo-router";
import { LogOut } from "lucide-react-native";
import React from "react";
import { Pressable } from "react-native";

const LogoutButton = () => {
  const { logout } = useAuth();
  return (
    <Pressable
      onPress={() => {
        logout();
        router.replace("/(auth)/LoginScreen");
      }}
      style={{
        marginRight: 10,
      }}
    >
      <LogOut color={"#FF3B30"} />
    </Pressable>
  );
};
export default function CustomerLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{ title: "Home", headerRight: () => <LogoutButton /> }}
      />
    </Stack>
  );
}
