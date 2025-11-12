import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from "react-native";

type Props = {
  onCreateUser: (data: any) => Promise<{ success: boolean; error?: string }>;
};

export const CreateCustomerForm = ({ onCreateUser }: Props) => {
  const [name, setName] = useState("");
  const [mobile, setMobile] = useState("");
  const [address, setAddress] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async () => {
    if (!name || !mobile || !password) {
      Alert.alert("Missing Information", "Please fill in all required fields.");
      return;
    }

    setIsLoading(true);
    const result = await onCreateUser({
      name,
      mobile_number: mobile,
      address,
      password,
    });
    setIsLoading(false);

    if (result.success) {
      setName("");
      setMobile("");
      setAddress("");
      setPassword("");
      Alert.alert("Success", "Customer created successfully.");
    } else {
      Alert.alert(
        "Error",
        result.error || "An error occurred. Please try again.",
      );
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Create Customer</Text>

      <View style={styles.formGroup}>
        <TextInput
          style={styles.input}
          placeholder="Full Name"
          value={name}
          onChangeText={setName}
        />
        <TextInput
          style={styles.input}
          placeholder="Mobile Number"
          value={mobile}
          keyboardType="phone-pad"
          onChangeText={setMobile}
        />
        <TextInput
          style={styles.input}
          placeholder="Address (Optional)"
          value={address}
          onChangeText={setAddress}
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />
      </View>

      <TouchableOpacity
        style={[styles.button, isLoading && styles.buttonDisabled]}
        onPress={handleSubmit}
        disabled={isLoading}
        activeOpacity={0.8}
      >
        {isLoading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Create Account</Text>
        )}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fafafa",
    padding: 24,
    borderRadius: 16,
    marginTop: 30,
    elevation: 3,
  },
  header: {
    fontSize: 24,
    fontWeight: "600",
    color: "#333",
    marginBottom: 20,
    textAlign: "center",
  },
  formGroup: {
    marginBottom: 20,
  },
  input: {
    backgroundColor: "#fff",
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#e1e1e1",
    fontSize: 16,
    marginBottom: 12,
    color: "#222",
  },
  button: {
    backgroundColor: "#007AFF",
    paddingVertical: 15,
    borderRadius: 12,
    alignItems: "center",
  },
  buttonDisabled: {
    backgroundColor: "#9bbcff",
  },
  buttonText: {
    color: "#fff",
    fontSize: 17,
    fontWeight: "600",
  },
});

export default CreateCustomerForm;
