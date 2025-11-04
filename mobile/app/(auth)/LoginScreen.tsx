import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useAuth } from "@/context/AuthContext";

export default function LoginScreen() {
  const { login } = useAuth();

  const [mobileNumber, setMobileNumber] = useState("");
  const [password, setPassword] = useState("");
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(false);

  const BACKEND_URL = process.env.EXPO_PUBLIC_BACKEND_URL;

  const onLogin = async () => {
    if (!mobileNumber || !password) {
      Alert.alert(
        "Missing Fields",
        "Please enter your mobile number and password.",
      );
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${BACKEND_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mobile_number: mobileNumber, password }),
      });

      const data = await res.json();

      if (!res.ok || !data.accessToken) {
        Alert.alert(
          "Login Failed",
          data.error || "Please check your credentials.",
        );
        setLoading(false);
        return;
      }

      await AsyncStorage.setItem("accessToken", data.accessToken);
      await AsyncStorage.setItem("refreshToken", data.refreshToken);

      login(data.role);
    } catch (error) {
      console.error("Login error:", error);
      Alert.alert("Error", "Unable to connect to the server.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Welcome Back</Text>
      <Text style={styles.subtext}>Sign in with your mobile number</Text>

      <TextInput
        placeholder="Mobile Number"
        keyboardType="phone-pad"
        value={mobileNumber}
        onChangeText={setMobileNumber}
        style={styles.input}
        editable={!loading}
        placeholderTextColor="#999"
      />

      <View style={styles.passwordContainer}>
        <TextInput
          placeholder="Password"
          secureTextEntry={!visible}
          value={password}
          onChangeText={setPassword}
          style={[styles.input, { flex: 1, marginBottom: 0 }]}
          editable={!loading}
          placeholderTextColor="#999"
        />
        <TouchableOpacity
          onPress={() => setVisible(!visible)}
          style={styles.showButton}
        >
          <Text style={styles.showButtonText}>{visible ? "Hide" : "Show"}</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        style={[styles.loginButton, loading && styles.disabled]}
        onPress={onLogin}
        activeOpacity={0.8}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.loginText}>Sign In</Text>
        )}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 24,
    backgroundColor: "#f2f2f7",
  },
  header: {
    fontSize: 28,
    fontWeight: "700",
    textAlign: "center",
    color: "#111",
    marginBottom: 6,
  },
  subtext: {
    fontSize: 16,
    color: "#6e6e73",
    textAlign: "center",
    marginBottom: 30,
  },
  input: {
    backgroundColor: "#fff",
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 12,
    fontSize: 16,
    color: "#111",
    borderWidth: 1,
    borderColor: "#e5e5ea",
    marginBottom: 16,
  },
  passwordContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
    backgroundColor: "#fff",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#e5e5ea",
    paddingRight: 10,
  },
  showButton: {
    paddingHorizontal: 10,
  },
  showButtonText: {
    color: "#007AFF",
    fontWeight: "500",
    fontSize: 15,
  },
  loginButton: {
    backgroundColor: "#007AFF",
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: "center",
  },
  loginText: {
    color: "#fff",
    fontSize: 17,
    fontWeight: "600",
  },
  disabled: {
    opacity: 0.6,
  },
});
