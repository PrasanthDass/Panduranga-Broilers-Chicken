import { router } from "expo-router";
import { Pressable, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Home() {
  const routes = [
    { name: "Login", path: "/screens/auth/login" },
    { name: "Admin Home", path: "/screens/admin/home" },
    { name: "Customer Home", path: "/screens/customer/home" },
  ];

  return (
    <SafeAreaView
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        gap: 20,
      }}
    >
      <Text style={{ fontSize: 24, marginBottom: 20 }}>Home Page</Text>
      {routes.map((route) => (
        <Pressable
          key={route.path}
          style={({ pressed }) => [
            {
              backgroundColor: pressed ? "#ccc" : "#007AFF",
              padding: 10,
              borderRadius: 5,
              width: "80%",
            },
          ]}
          onPress={() => router.push(route.path)}
        >
          <Text style={{ color: "white", fontSize: 18 }}>{route.name}</Text>
        </Pressable>
      ))}
    </SafeAreaView>
  );
}
