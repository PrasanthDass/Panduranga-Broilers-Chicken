import { useAuth } from "@/context/AuthContext";
import { Stack, router } from "expo-router";
import React from "react";
import { Pressable, Text, StyleSheet, View } from "react-native";
import { LogOut } from "lucide-react-native";

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
const LeftButton = ({ name }: { name: string }) => (
  <View>
    <Text>{name}</Text>
  </View>
);

export default function AdminLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          title: "Admin",
          headerRight: () => <LogoutButton />,
          headerShadowVisible: false,
          headerStyle: { backgroundColor: "#f9f9f9" },
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
      <Stack.Screen
        name="CreateBill"
        options={{
          title: "Create New Bill",
          headerShown: true,
          headerBackTitle: "Back",
        }}
      />
      <Stack.Screen
        name="Reports"
        options={{
          title: "Sales Reports",
          headerShown: true,
          headerBackTitle: "Back",
        }}
      />
      <Stack.Screen
        name="Customers"
        options={{
          title: "All Customers",
          headerShown: true,
          headerBackTitle: "Back",
          headerStyle: { backgroundColor: "#f2f2f7" },
          headerShadowVisible: false,
        }}
      />
    </Stack>
  );
}
