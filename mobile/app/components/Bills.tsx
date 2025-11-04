import React from "react";
import { View, Text, FlatList, StyleSheet } from "react-native";
import { Bill } from "@/app/hooks/useAdminDashboard";

type Props = {
  transactions: Bill[];
};

const TransactionItem = ({ item }: { item: Bill }) => (
  <View style={styles.card}>
    <View style={styles.cardHeader}>
      <Text style={styles.cardTitle}>{item.customers.name}</Text>
      <View style={styles.amountTag}>
        <Text style={styles.amountTagText}>₹{item.amount.toFixed(2)}</Text>
      </View>
    </View>

    <View style={styles.cardFooter}>
      <Text style={styles.footerText}>
        {new Date(item.created_at).toLocaleDateString()}
      </Text>
      <Text style={styles.footerText}>Bill ID: {item.id}</Text>
    </View>
  </View>
);

export const BillList = ({ transactions }: Props) => (
  <View style={styles.listContainer}>
    <Text style={styles.title}>Last 10 Transactions</Text>
    {transactions.length > 0 ? (
      <FlatList
        data={transactions}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => <TransactionItem item={item} />}
        scrollEnabled={false}
      />
    ) : (
      <Text style={styles.emptyText}>No transactions found.</Text>
    )}
  </View>
);

export default BillList;

const styles = StyleSheet.create({
  listContainer: {
    marginTop: 24,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 8,
    color: "#111",
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginVertical: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "500",
    color: "#222",
  },
  amountTag: {
    backgroundColor: "#E7F5FF",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },
  amountTagText: {
    color: "#007AFF",
    fontWeight: "bold",
    fontSize: 14,
  },
  cardFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    borderTopWidth: 1,
    borderTopColor: "#f0f0f0",
    paddingTop: 12,
    marginTop: 8,
  },
  footerText: {
    fontSize: 12,
    color: "#666",
  },
  emptyText: {
    color: "#666",
    textAlign: "center",
    marginTop: 20,
  },
});
