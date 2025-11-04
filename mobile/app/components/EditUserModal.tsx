import React, { useState, useEffect } from "react";
import {
  Modal,
  View,
  Text,
  TextInput,
  StyleSheet,
  Pressable,
  Alert,
  ActivityIndicator,
} from "react-native";
import { User } from "../hooks/useUsers";

type Props = {
  user: User | null;
  visible: boolean;
  onClose: () => void;
  onSave: (userId: number, data: any) => Promise<{ success: boolean }>;
};

export const EditUserModal = ({ user, visible, onClose, onSave }: Props) => {
  const [name, setName] = useState("");
  const [mobile, setMobile] = useState("");
  const [role, setRole] = useState<"admin" | "customer">("customer");
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (user) {
      setName(user.name);
      setMobile(user.mobile_number);
      setRole(user.role);
    }
  }, [user]);

  const handleSave = async () => {
    if (!user) return;
    setIsSaving(true);

    const result = await onSave(user.id, {
      name,
      mobile_number: mobile,
      role,
    });

    setIsSaving(false);
    if (result.success) {
      Alert.alert("Success", "User updated successfully.");
      onClose();
    } else {
      Alert.alert("Error", "Failed to update user.");
    }
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.overlay}>
        <View style={styles.modalCard}>
          <Text style={styles.header}>Edit User</Text>

          <TextInput
            style={styles.input}
            placeholder="Full Name"
            value={name}
            onChangeText={setName}
            placeholderTextColor="#999"
          />

          <TextInput
            style={styles.input}
            placeholder="Mobile Number"
            value={mobile}
            onChangeText={setMobile}
            keyboardType="phone-pad"
            placeholderTextColor="#999"
          />

          <View style={styles.roleContainer}>
            <Pressable
              style={[
                styles.roleOption,
                role === "customer" && styles.roleOptionActive,
              ]}
              onPress={() => setRole("customer")}
            >
              <Text
                style={
                  role === "customer" ? styles.roleTextActive : styles.roleText
                }
              >
                Customer
              </Text>
            </Pressable>
            <Pressable
              style={[
                styles.roleOption,
                role === "admin" && styles.roleOptionActive,
              ]}
              onPress={() => setRole("admin")}
            >
              <Text
                style={
                  role === "admin" ? styles.roleTextActive : styles.roleText
                }
              >
                Admin
              </Text>
            </Pressable>
          </View>

          <View style={styles.footer}>
            <Pressable onPress={onClose} style={styles.cancelBtn}>
              <Text style={styles.cancelText}>Cancel</Text>
            </Pressable>
            <Pressable
              onPress={handleSave}
              style={[styles.saveBtn, isSaving && styles.disabled]}
              disabled={isSaving}
            >
              {isSaving ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.saveText}>Save</Text>
              )}
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.35)",
  },
  modalCard: {
    width: "90%",
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 24,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 8 },
    elevation: 8,
  },
  header: {
    fontSize: 22,
    fontWeight: "600",
    color: "#111",
    textAlign: "center",
    marginBottom: 24,
  },
  input: {
    backgroundColor: "#f2f2f7",
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 12,
    fontSize: 16,
    color: "#000",
    marginBottom: 14,
  },
  roleContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 16,
  },
  roleOption: {
    flex: 1,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: "#c7c7cc",
    borderRadius: 12,
    marginHorizontal: 6,
    alignItems: "center",
  },
  roleOptionActive: {
    backgroundColor: "#007AFF",
    borderColor: "#007AFF",
  },
  roleText: {
    color: "#007AFF",
    fontWeight: "500",
  },
  roleTextActive: {
    color: "#fff",
    fontWeight: "600",
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },
  cancelBtn: {
    flex: 1,
    marginRight: 10,
    alignItems: "center",
    paddingVertical: 14,
    backgroundColor: "#f2f2f7",
    borderRadius: 12,
  },
  saveBtn: {
    flex: 1,
    marginLeft: 10,
    alignItems: "center",
    paddingVertical: 14,
    backgroundColor: "#007AFF",
    borderRadius: 12,
  },
  disabled: {
    opacity: 0.6,
  },
  cancelText: {
    color: "#007AFF",
    fontSize: 16,
    fontWeight: "500",
  },
  saveText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});

export default EditUserModal;
