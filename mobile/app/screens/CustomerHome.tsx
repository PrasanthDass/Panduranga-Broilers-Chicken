import React, { useEffect, useState } from "react";
import { View, Text, FlatList, StyleSheet } from "react-native";
import { useAuth } from "../_layout";

type Bill = {
  id: number;
  description: string;
  amount: number;
  status: string;
  due_date: string;
};

export default function CustomerHome() {
  const { logout } = useAuth();
  const [bills, setBills] = useState<Bill[]>([]);

  useEffect(() => {
    fetch("http://localhost:3000/bills", {
      headers: {
        Authorization: `Bearer your_jwt_token`,
      },
    })
      .then((res) => res.json())
      .then((data) => setBills(data.bills))
      .catch(() => setBills([]));
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>My Bills</Text>
      <FlatList
        data={bills}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.billItem}>
            <Text>Description: {item.description}</Text>
            <Text>Amount: ₹{item.amount.toFixed(2)}</Text>
            <Text>Status: {item.status}</Text>
            <Text>Due: {new Date(item.due_date).toLocaleDateString()}</Text>
          </View>
        )}
      />
      <Text style={styles.logout} onPress={logout}>
        Logout
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  title: { fontSize: 20, fontWeight: "bold", marginBottom: 12 },
  billItem: {
    padding: 10,
    backgroundColor: "#eee",
    borderRadius: 8,
    marginVertical: 6,
  },
  logout: {
    marginTop: 30,
    textAlign: "center",
    color: "red",
    fontWeight: "bold",
  },
});
