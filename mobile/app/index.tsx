import { styles } from "@/app/style/styles";
import { router } from "expo-router";
import { Pressable, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Home() {
  let routes = [
    { name: "Login", path: "/screens/auth/login" },
    { name: "Admin Home", path: "/screens/admin/home" },
    { name: "Customer Home", path: "/screens/customer/home" },
  ];
  return (
    <SafeAreaView
      style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
    >
      <Text>Home Page</Text>
      {routes.map((route) => (
        <Pressable
          key={route.path}
          style={({ pressed }) => [styles.pressable, pressed && styles.focus]}
          onPress={() => router.push(route.path)}
        >
          <Text style={styles.pressable_text}>{route.name}</Text>
        </Pressable>
      ))}
    </SafeAreaView>
  );
}
