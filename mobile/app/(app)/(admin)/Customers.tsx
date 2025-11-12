import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  Alert,
} from "react-native";
import { router } from "expo-router";
import { getCustomers } from "@/app/services/admin";

type Customer = {
  id: number;
  name: string;
  current_balance: number;
};

const CustomerCard = ({ item }: { item: Customer }) => {
  const balanceColor = item.current_balance > 0 ? "#D93232" : "#3A9E56";
  const handlePress = () => {
    router.push({
      pathname: "/(app)/(admin)/Reports",
      params: {
        customer_id: item.id,
        customer_name: item.name,
      },
    });
  };

  return (
    <TouchableOpacity
      style={styles.linkCard}
      onPress={handlePress}
      activeOpacity={0.8}
    >
      <View>
        <Text style={styles.linkText}>{item.name}</Text>
        <Text style={[styles.balanceText, { color: balanceColor }]}>
          Balance: ₹{item.current_balance.toFixed(2)}
        </Text>
      </View>
      <Text style={styles.arrow}>›</Text>
    </TouchableOpacity>
  );
};

export default function CustomersScreen() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await getCustomers();
        setCustomers(data.customers);
      } catch (error: any) {
        Alert.alert("Error", "Could not load customers: " + error.message);
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, []);

  if (isLoading) {
    return <ActivityIndicator size="large" style={styles.loader} />;
  }

  return (
    <FlatList
      style={styles.container}
      data={customers}
      keyExtractor={(item) => item.id.toString()}
      renderItem={({ item }) => <CustomerCard item={item} />}
      ListHeaderComponent={<Text style={styles.title}>All Customers</Text>}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 18,
    backgroundColor: "#f2f2f7",
  },
  loader: {
    flex: 1,
    justifyContent: "center",
  },
  title: {
    fontSize: 32,
    fontWeight: "700",
    color: "#111",
    paddingTop: 10,
    marginBottom: 10,
  },
  linkCard: {
    backgroundColor: "#fff",
    paddingVertical: 14,
    paddingHorizontal: 18,
    borderRadius: 14,
    marginVertical: 6,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
  },
  linkText: {
    fontSize: 17,
    color: "#111",
    fontWeight: "500",
  },
  balanceText: {
    fontSize: 14,
    fontWeight: "600",
    marginTop: 4,
  },
  arrow: {
    fontSize: 24,
    color: "#c7c7cc",
  },
});
