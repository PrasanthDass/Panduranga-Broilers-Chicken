import React, { useEffect, useState, createContext, useContext } from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import AsyncStorage from "@react-native-async-storage/async-storage";

import LoginScreen from "./screens/LoginScreen";
import AdminDashboard from "./screens/AdminDashboard";
import CustomerHome from "./screens/CustomerHome";

const Stack = createNativeStackNavigator();

type User = { role: "admin" | "customer" | null };

type AuthContextType = {
  user: User | null;
  login: (role: User["role"]) => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  login: () => {},
  logout: () => {},
});

export const useAuth = () => useContext(AuthContext);

export default function Layout() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    AsyncStorage.getItem("userRole")
      .then((role) => {
        if (role === "admin" || role === "customer") setUser({ role });
      })
      .finally(() => setLoading(false));
  }, []);

  const login = async (role: User["role"]) => {
    setUser({ role });
    await AsyncStorage.setItem("userRole", role || "");
  };

  const logout = async () => {
    const refreshToken = await AsyncStorage.getItem("refreshToken");
    if (refreshToken) {
      try {
        await fetch("http://10.206.79.172:3000/logout", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ refreshToken }),
        });
      } catch (e) {
        console.log(e);
      }
    }

    await AsyncStorage.removeItem("userRole");
    await AsyncStorage.removeItem("accessToken");
    await AsyncStorage.removeItem("refreshToken");
    setUser(null);
  };

  if (loading) return null;

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {!user ? (
          <Stack.Screen name="Login" component={LoginScreen} />
        ) : user.role === "admin" ? (
          <Stack.Screen name="AdminDashboard" component={AdminDashboard} />
        ) : (
          <Stack.Screen name="CustomerHome" component={CustomerHome} />
        )}
      </Stack.Navigator>
    </AuthContext.Provider>
  );
}
