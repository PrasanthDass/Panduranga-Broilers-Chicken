import { useAuth } from "@/context/AuthContext";
import { Stack, router } from "expo-router";
import React from "react";
import { Pressable, Text, StyleSheet } from "react-native";

const LogoutButton = () => {
  const { logout } = useAuth();
  return (
    <Pressable
      onPress={() => {
        logout();
        router.replace("/(auth)/LoginScreen");
      }}
    >
      <Text style={styles.logoutText}>Logout</Text>
    </Pressable>
  );
};

export default function AdminLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          headerShown: true,
          title: "Admin",
          headerRight: () => <LogoutButton />,
          headerShadowVisible: false,
          headerStyle: { backgroundColor: "#f9f9f9" },
          headerTitleStyle: { fontSize: 18 },
        }}
      />
      <Stack.Screen
        name="ManageUsers"
        options={{
          title: "Manage Users",
          headerShown: true,
          headerBackTitle: "Back",
        }}
      />
    </Stack>
  );
}

const styles = StyleSheet.create({
  logoutText: {
    color: "red",
    fontSize: 16,
    marginRight: 10,
  },
});
