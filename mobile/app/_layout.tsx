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
    setUser(null);
    await AsyncStorage.removeItem("userRole");
  };

  if (loading) return null;

  let initialRouteName = "Login";
  if (user)
    initialRouteName =
      user.role === "admin" ? "AdminDashboard" : "CustomerHome";

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      <Stack.Navigator initialRouteName={initialRouteName}>
        <Stack.Screen
          name="Login"
          component={LoginScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="AdminDashboard"
          component={AdminDashboard}
          options={{ title: "Admin Dashboard" }}
        />
        <Stack.Screen
          name="CustomerHome"
          component={CustomerHome}
          options={{ title: "Customer Home" }}
        />
      </Stack.Navigator>
    </AuthContext.Provider>
  );
}
