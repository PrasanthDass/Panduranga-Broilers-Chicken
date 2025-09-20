import React, { useEffect, useState } from "react";
import { View, Text, FlatList, StyleSheet, ScrollView } from "react-native";
import { useAuth } from "../_layout";
import { BarChart } from "react-native-chart-kit";
import { Dimensions } from "react-native";

const screenWidth = Dimensions.get("window").width;

type WeeklySale = {
  week_start: string;
  total_sales: number;
};

type Transaction = {
  id: number;
  customer_id: number;
  amount: number;
  status: string;
  due_date: string;
  created_at: string;
};

export default function AdminDashboard() {
  const { logout } = useAuth();
  const [weeklySales, setWeeklySales] = useState<WeeklySale[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  useEffect(() => {
    fetch("http://localhost:3000/dashboard/weekly-sales")
      .then((res) => res.json())
      .then((data) => setWeeklySales(data.weeklySales))
      .catch(() => setWeeklySales([]));

    fetch("http://localhost:3000/dashboard/last-transactions")
      .then((res) => res.json())
      .then((data) => setTransactions(data.transactions))
      .catch(() => setTransactions([]));
  }, []);

  const chartData = {
    labels: weeklySales.map((w) => new Date(w.week_start).toLocaleDateString()),
    datasets: [
      {
        data: weeklySales.map((w) => w.total_sales),
      },
    ],
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Weekly Sales</Text>
      {weeklySales.length > 0 ? (
        <BarChart
          data={chartData}
          width={screenWidth - 32}
          height={220}
          yAxisLabel="₹"
          chartConfig={{
            backgroundColor: "#1e2923",
            backgroundGradientFrom: "#08130D",
            backgroundGradientTo: "#1c2a12",
            decimalPlaces: 2,
            color: (opacity = 1) => `rgba(26, 255, 146, ${opacity})`,
            labelColor: () => "#fff",
            style: { borderRadius: 16 },
          }}
          style={{ marginVertical: 8, borderRadius: 16 }}
          yAxisSuffix={"Sales"}
        />
      ) : (
        <Text>No sales data available</Text>
      )}

      <Text style={styles.title}>Last 10 Transactions</Text>
      <FlatList
        data={transactions}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.transactionItem}>
            <Text>Bill ID: {item.id}</Text>
            <Text>Customer ID: {item.customer_id}</Text>
            <Text>Amount: ₹{item.amount.toFixed(2)}</Text>
            <Text>Status: {item.status}</Text>
            <Text>
              Due Date: {new Date(item.due_date).toLocaleDateString()}
            </Text>
          </View>
        )}
      />

      <Text style={styles.logout} onPress={logout}>
        Logout
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  title: { fontSize: 20, fontWeight: "bold", marginTop: 16 },
  transactionItem: {
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
