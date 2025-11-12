import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import { Link, RelativePathString } from "expo-router";
import { useAuth } from "@/context/AuthContext";
import useAdminDashboard from "@/app/hooks/useAdminDashboard";
import StatCard from "@/app/components/StatCard";
import BillList from "@/app/components/Bills";

export default function AdminDashboard() {
  const { logout } = useAuth();
  const { sales, transactions, isLoading, error } = useAdminDashboard();

  const manage_user_path = "/(admin)/ManageUsers" as RelativePathString;
  const create_bill_path = "/(admin)/CreateBill" as RelativePathString;
  const reports_path = "/(admin)/Reports" as RelativePathString;
  const customers_path = "/(admin)/Customers" as RelativePathString;

  const renderContent = () => {
    if (isLoading) {
      return (
        <ActivityIndicator size="large" style={styles.loader} color="#007AFF" />
      );
    }

    if (error) {
      return <Text style={styles.error}>Error: {error}</Text>;
    }

    return (
      <>
        <View style={styles.statsContainer}>
          <StatCard
            title="Total Sales (7 days)"
            value={`₹${sales?.totalSales.toFixed(2) ?? "0.00"}`}
          />
          <StatCard
            title="Total Bills (7 days)"
            value={sales?.totalBills?.toString() ?? "0"}
          />
        </View>
        <BillList transactions={transactions} />
      </>
    );
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <Text style={styles.title}>Dashboard</Text>

      {renderContent()}

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Admin Tools</Text>

        <Link href={manage_user_path} asChild>
          <TouchableOpacity style={styles.linkCard} activeOpacity={0.8}>
            <Text style={styles.linkText}>Manage Customers & Users</Text>
            <Text style={styles.arrow}>›</Text>
          </TouchableOpacity>
        </Link>

        <Link href={create_bill_path} asChild>
          <TouchableOpacity style={styles.linkCard} activeOpacity={0.8}>
            <Text style={styles.linkText}>Create New Bill</Text>
            <Text style={styles.arrow}>›</Text>
          </TouchableOpacity>
        </Link>
        <Link href={reports_path} asChild>
          <TouchableOpacity style={styles.linkCard}>
            <Text style={styles.linkText}>View Reports</Text>
            <Text style={styles.arrow}>›</Text>
          </TouchableOpacity>
        </Link>
        <Link href={customers_path} asChild>
          <TouchableOpacity style={styles.linkCard} activeOpacity={0.8}>
            <Text style={styles.linkText}>View All Customers</Text>
            <Text style={styles.arrow}>›</Text>
          </TouchableOpacity>
        </Link>
        <TouchableOpacity onPress={logout} style={styles.logoutBtn}>
          <Text style={styles.logoutText}>Log Out</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 25,
    paddingVertical: 12,
    backgroundColor: "#f2f2f7",
  },
  title: {
    fontSize: 22,
    fontWeight: "600",
    color: "#111",
    marginBottom: 12,
  },
  statsContainer: {
    marginBottom: 12,
  },
  loader: {
    marginTop: 12,
  },
  error: {
    color: "#ff3b30",
    fontSize: 16,
    textAlign: "center",
    marginTop: 50,
  },
  section: {
    marginTop: 10,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: "600",
    color: "#111",
    marginBottom: 12,
    paddingHorizontal: 4,
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
  arrow: {
    fontSize: 24,
    color: "#c7c7cc",
  },
  logoutBtn: {
    backgroundColor: "#fff",
    paddingVertical: 14,
    borderRadius: 14,
    marginTop: 12,
    marginBottom: 20,
    alignItems: "center",
  },
  logoutText: {
    fontSize: 17,
    color: "#ff3b30",
    fontWeight: "500",
  },
});
