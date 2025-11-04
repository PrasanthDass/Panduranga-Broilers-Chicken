import React, {
  useEffect,
  useState,
  createContext,
  useContext,
  useMemo,
  useCallback,
} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";

const BACKEND_URL = process.env.EXPO_PUBLIC_BACKEND_URL;

type User = { role: "admin" | "customer" | null };

type AuthContextType = {
  user: User | null;
  login: (role: User["role"]) => void;
  logout: () => void;
  loading: boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    AsyncStorage.getItem("userRole")
      .then((role) => {
        if (role === "admin" || role === "customer") {
          setUser({ role });
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const login = useCallback(async (role: User["role"]) => {
    setUser({ role });
    await AsyncStorage.setItem("userRole", role || "");
  }, []);

  const logout = useCallback(async () => {
    const refreshToken = await AsyncStorage.getItem("refreshToken");
    if (refreshToken) {
      try {
        await fetch(`${BACKEND_URL}/logout`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ refreshToken }),
        });
      } catch (e) {
        console.error(
          "Server logout failed, proceeding with client logout:",
          e,
        );
      }
    }

    await AsyncStorage.removeItem("userRole");
    await AsyncStorage.removeItem("accessToken");
    await AsyncStorage.removeItem("refreshToken");

    setUser(null);

    router.replace("/(auth)/LoginScreen");
  }, []);

  const authContextValue = useMemo(
    () => ({
      user,
      login,
      logout,
      loading,
    }),
    [user, login, logout, loading],
  );

  return (
    <AuthContext.Provider value={authContextValue}>
      {children}
    </AuthContext.Provider>
  );
};
