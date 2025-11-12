import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Button,
  StyleSheet,
  Alert,
  FlatList,
  ActivityIndicator,
  Platform,
  Pressable,
  TextInput,
} from "react-native";
import { useLocalSearchParams } from "expo-router";
import { getBillsReport, getCustomers } from "@/app/services/admin";
import DateTimePicker, {
  DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
import { Picker } from "@react-native-picker/picker";

type ReportItem = {
  id: number;
  bill_date: string;
  amount: number;
  kgs_distributed: number;
  customers: {
    name: string;
  };
};

type Customer = {
  id: number;
  name: string;
};

const ReportItemRow = ({ item }: { item: ReportItem }) => (
  <View style={styles.card}>
    <View style={styles.cardHeader}>
      <Text style={styles.cardTitle}>{item.customers?.name || "N/A"}</Text>
      <Text style={styles.amount}>₹{item.amount.toFixed(2)}</Text>
    </View>
    <View style={styles.cardFooter}>
      <Text style={styles.footerText}>
        Date: {new Date(item.bill_date).toLocaleDateString()}
      </Text>
      <Text style={styles.footerText}>Bill ID: {item.id}</Text>
    </View>
  </View>
);

export default function ReportsScreen() {
  const params = useLocalSearchParams();
  const passedCustomerId = params.customer_id
    ? Number(params.customer_id)
    : null;
  const passedCustomerName = params.customer_name
    ? String(params.customer_name)
    : "All Customers";

  const [customers, setCustomers] = useState<Customer[]>([]);
  const [selectedCustomerId, setSelectedCustomerId] = useState<number | "all">(
    passedCustomerId || "all",
  );
  const [startDate, setStartDate] = useState(
    new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
  );
  const [endDate, setEndDate] = useState(new Date());
  const [showPicker, setShowPicker] = useState<false | "start" | "end">(false);

  const [reportData, setReportData] = useState<ReportItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const loadCustomers = async () => {
      try {
        const data = await getCustomers();
        if (
          passedCustomerId &&
          !data.customers.some((c: Customer) => c.id === passedCustomerId)
        ) {
          setCustomers([
            { id: passedCustomerId, name: passedCustomerName },
            ...data.customers,
          ]);
        } else {
          setCustomers(data.customers);
        }
      } catch (error) {
        console.error("Failed to load customers", error);
      }
    };
    loadCustomers();
  }, [passedCustomerId, passedCustomerName]);

  const onDateChange = (event: DateTimePickerEvent, selectedDate?: Date) => {
    const currentDate =
      selectedDate || (showPicker === "start" ? startDate : endDate);
    if (Platform.OS === "android") {
      setShowPicker(false);
    }
    if (showPicker === "start") {
      setStartDate(currentDate);
    } else {
      setEndDate(currentDate);
    }
  };

  const handleGenerateReport = async () => {
    setIsLoading(true);
    setReportData([]);
    try {
      const start = startDate.toISOString().split("T")[0];
      const end = endDate.toISOString().split("T")[0];

      const filters: {
        startDate: string;
        endDate: string;
        customerId?: number;
      } = {
        startDate: start,
        endDate: end,
      };

      if (selectedCustomerId !== "all") {
        filters.customerId = selectedCustomerId;
      }

      const data = await getBillsReport(start, end, filters);

      setReportData(data.report);
      if (data.report.length === 0) {
        Alert.alert("No Data", "No bills found with these filters.");
      }
    } catch (error: any) {
      Alert.alert("Error", "Could not generate report: " + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const totalSales = reportData.reduce((sum, item) => sum + item.amount, 0);
  const totalBills = reportData.length;

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Customer</Text>
      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={selectedCustomerId}
          onValueChange={(itemValue) => setSelectedCustomerId(itemValue)}
          style={styles.picker}
        >
          <Picker.Item label="All Customers" value="all" />
          {customers.map((customer) => (
            <Picker.Item
              key={customer.id}
              label={customer.name}
              value={customer.id}
            />
          ))}
        </Picker>
      </View>

      <Text style={styles.label}>Date Range</Text>
      <View style={styles.dateRangeContainer}>
        <Pressable
          onPress={() => setShowPicker("start")}
          style={styles.datePicker}
        >
          <Text style={styles.dateLabel}>Start Date</Text>
          <TextInput
            style={styles.input}
            value={startDate.toLocaleDateString()}
            editable={false}
          />
        </Pressable>
        <Pressable
          onPress={() => setShowPicker("end")}
          style={styles.datePicker}
        >
          <Text style={styles.dateLabel}>End Date</Text>
          <TextInput
            style={styles.input}
            value={endDate.toLocaleDateString()}
            editable={false}
          />
        </Pressable>
      </View>

      {showPicker && Platform.OS === "android" && (
        <DateTimePicker
          value={showPicker === "start" ? startDate : endDate}
          mode="date"
          display="default"
          onChange={onDateChange}
        />
      )}
      {Platform.OS === "ios" && showPicker && (
        <DateTimePicker
          value={showPicker === "start" ? startDate : endDate}
          mode="date"
          display="spinner"
          onChange={onDateChange}
        />
      )}

      <Pressable
        style={styles.button}
        onPress={handleGenerateReport}
        disabled={isLoading}
      >
        <Text style={styles.buttonText}>Generate Report</Text>
      </Pressable>
      {isLoading ? (
        <ActivityIndicator size="large" style={{ marginTop: 40 }} />
      ) : (
        <FlatList
          style={{ flex: 1, marginTop: 20 }}
          data={reportData}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => <ReportItemRow item={item} />}
          ListHeaderComponent={
            reportData.length > 0 ? (
              <View style={styles.totalsContainer}>
                <Text style={styles.totalText}>
                  Total Sales: ₹{totalSales.toFixed(2)}
                </Text>
                <Text style={styles.totalText}>Total Bills: {totalBills}</Text>
              </View>
            ) : null
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 18,
    paddingTop: 10,
    backgroundColor: "#f2f2f7",
  },
  label: {
    fontSize: 14,
    color: "#333",
    marginBottom: 8,
    fontWeight: "500",
    marginTop: 10,
  },
  dateLabel: {
    fontSize: 14,
    color: "#333",
    marginBottom: 8,
    fontWeight: "500",
  },
  pickerContainer: {
    backgroundColor: "#fff",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#e0e0e0",
    marginBottom: 10,
    justifyContent: "center",
  },
  picker: {
    width: "100%",
    backgroundColor: "transparent",
  },
  dateRangeContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  datePicker: {
    flex: 1,
    marginHorizontal: 4,
  },
  input: {
    backgroundColor: "#fff",
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#e0e0e0",
    fontSize: 16,
    color: "#111",
  },
  totalsContainer: {
    padding: 16,
    marginVertical: 10,
    backgroundColor: "#fff",
    borderRadius: 14,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
  },
  totalText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111",
    lineHeight: 24,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 14,
    paddingVertical: 14,
    paddingHorizontal: 18,
    marginVertical: 6,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  cardTitle: {
    fontSize: 17,
    fontWeight: "500",
    color: "#111",
  },
  amount: {
    fontSize: 16,
    fontWeight: "600",
    color: "#007AFF",
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
  button: {
    backgroundColor: "#007AFF",
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: "center",
    marginTop: 4,
    marginHorizontal: 4,
  },
  buttonText: {
    color: "#fff",
    fontSize: 15,
  },
});
