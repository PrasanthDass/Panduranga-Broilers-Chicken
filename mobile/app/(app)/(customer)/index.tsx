import { useAuth } from "@/context/AuthContext";
import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  Alert,
  RefreshControl,
  TouchableOpacity,
} from "react-native";
import { getMyBills, getMyDetails } from "@/app/services/customer";
import StatCard from "@/app/components/StatCard";

type CustomerDetails = {
  id: number;
  name: string;
  current_balance: number;
};

type Bill = {
  id: number;
  due_date: string;
  amount: number;
  quantity_kgs: number;
};

const CustomerBillItem = ({ item }: { item: Bill }) => (
  <View style={styles.card}>
    <View style={styles.cardHeader}>
      <Text style={styles.cardTitle}>Bill ID: {item.id}</Text>
      <View style={styles.amountTag}>
        <Text style={styles.amountTagText}>
          ₹{typeof item.amount === "number" ? item.amount.toFixed(2) : "0.00"}
        </Text>
      </View>
    </View>
    <View style={styles.cardFooter}>
      <Text style={styles.footerText}>
        Date: {new Date(item.due_date).toLocaleDateString()}
      </Text>
      <Text style={styles.footerText}>{item.quantity_kgs} KGs</Text>
    </View>
  </View>
);

export default function CustomerDashboard() {
  const { logout } = useAuth();
  const [details, setDetails] = useState<CustomerDetails | null>(null);
  const [bills, setBills] = useState<Bill[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadData = async () => {
    try {
      const detailsData = await getMyDetails();
      const billsData = await getMyBills();
      setDetails(detailsData);
      setBills(billsData.bills);
    } catch (error: any) {
      console.log(error);
      Alert.alert("Error", "Could not load your data. " + error.message);
      if (error.message.includes("401")) {
        logout();
      }
    }
  };

  useEffect(() => {
    setIsLoading(true);
    loadData().finally(() => setIsLoading(false));
  }, []);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  }, []);

  if (isLoading) {
    return <ActivityIndicator size="large" style={styles.loader} />;
  }

  const balance = details?.current_balance ?? 0;

  return (
    <FlatList
      style={styles.container}
      data={bills}
      keyExtractor={(item) => item.id.toString()}
      renderItem={({ item }) => <CustomerBillItem item={item} />}
      ListHeaderComponent={
        <>
          <Text style={styles.title}>Welcome, {details?.name}</Text>
          <StatCard
            title="Your Current Balance"
            value={`₹${balance.toFixed(2)}`}
          />
          <Text style={styles.subtitle}>Your Bills</Text>
        </>
      }
      ListEmptyComponent={
        <Text style={styles.emptyText}>You have no bills.</Text>
      }
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
      ListFooterComponent={
        <TouchableOpacity onPress={logout} style={styles.logoutBtn}>
          <Text style={styles.logoutText}>Log Out</Text>
        </TouchableOpacity>
      }
      contentContainerStyle={
        bills.length === 0 && { flexGrow: 1, justifyContent: "center" }
      }
    />
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9f9f9",
    paddingHorizontal: 16,
  },
  loader: {
    flex: 1,
    justifyContent: "center",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 16,
    color: "#111",
    marginTop: 16,
  },
  subtitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginTop: 24,
    marginBottom: 8,
    color: "#111",
  },
  emptyText: {
    color: "#666",
    textAlign: "center",
    marginTop: 20,
    fontSize: 16,
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
  logoutBtn: {
    backgroundColor: "#fff",
    paddingVertical: 14,
    borderRadius: 14,
    marginVertical: 12,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
  },
  logoutText: {
    fontSize: 17,
    color: "#ff3b30",
    fontWeight: "500",
  },
});
