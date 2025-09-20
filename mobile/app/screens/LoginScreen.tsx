import React, { useState } from "react";
import { View, Text, TextInput, Button, StyleSheet, Alert } from "react-native";
import { useAuth } from "../_layout";
import AsyncStorage from "@react-native-async-storage/async-storage";
import dotenv from "dotenv";

export default function LoginScreen() {
  const { login } = useAuth();

  const [mobileNumber, setMobileNumber] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const backend_url = "http://192.168.1.9:3000";

  const onLogin = async () => {
    if (!mobileNumber || !password) {
      Alert.alert("Error", "Please enter mobile number and password");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`${backend_url}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mobile_number: mobileNumber, password }),
      });

      const data = await res.json();

      console.log(data);
      if (!res.ok || !data.accessToken || !data.userId) {
        Alert.alert("Login Failed", data.error || "Invalid login data");
        setLoading(false);
        return;
      }

      await AsyncStorage.setItem("accessToken", data.accessToken);
      await AsyncStorage.setItem("refreshToken", data.refreshToken);

      login(data.role);

      console.log("Login successful, user role:", data.role);
      setLoading(false);
    } catch (error) {
      console.error("Login error:", error);
      Alert.alert("Error", "Failed to connect to server");
      setLoading(false);
    }
  };
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>
      <TextInput
        placeholder="Mobile Number"
        keyboardType="phone-pad"
        value={mobileNumber}
        onChangeText={setMobileNumber}
        style={styles.input}
        editable={!loading}
      />
      <TextInput
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
        style={styles.input}
        editable={!loading}
      />
      <Button
        title={loading ? "Logging in..." : "Login"}
        onPress={onLogin}
        disabled={loading}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", padding: 20 },
  title: {
    fontSize: 24,
    marginBottom: 20,
    fontWeight: "bold",
    textAlign: "center",
  },
  input: {
    borderWidth: 1,
    borderColor: "#aaa",
    borderRadius: 5,
    padding: 10,
    marginBottom: 15,
  },
});
