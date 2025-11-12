import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ScrollView,
  Pressable,
  Alert,
  Platform,
} from "react-native";
import { router } from "expo-router";
import { Picker } from "@react-native-picker/picker";
import DateTimePicker, {
  DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
import { createBill, getCustomers } from "@/app/services/admin";

type Customer = {
  id: number;
  name: string;
};

export default function CreateBillScreen() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [selectedCustomerId, setSelectedCustomerId] = useState<number | null>(
    null,
  );
  const [isLoading, setIsLoading] = useState(false);
  const [isFetchingCustomers, setIsFetchingCustomers] = useState(true);

  const [billDate, setBillDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);

  const [totalAmount, setTotalAmount] = useState("");
  const [kgsDistributed, setKgsDistributed] = useState("");
  const [kgsReturned, setKgsReturned] = useState("");
  const [extraKgs, setExtraKgs] = useState("");

  useEffect(() => {
    const loadCustomers = async () => {
      try {
        setIsFetchingCustomers(true);
        const data = await getCustomers();
        setCustomers(data.customers);
        if (data.customers.length > 0) {
          setSelectedCustomerId(data.customers[0].id);
        }
      } catch (error) {
        Alert.alert("Error", "Could not load customers.");
      } finally {
        setIsFetchingCustomers(false);
      }
    };
    loadCustomers();
  }, []);

  const onDateChange = (event: DateTimePickerEvent, selectedDate?: Date) => {
    if (event.type === "dismissed") {
      setShowDatePicker(false);
      return;
    }
    const currentDate = selectedDate || billDate;
    setShowDatePicker(false);
    setBillDate(currentDate);
  };

  const handleSubmit = async () => {
    if (!selectedCustomerId || !totalAmount) {
      Alert.alert("Error", "Customer and Total Amount are required.");
      return;
    }
    setIsLoading(true);
    try {
      const billData = {
        customer_id: selectedCustomerId,
        bill_date: billDate.toISOString(),
        total_amount: parseFloat(totalAmount),
        kgs_distributed: parseFloat(kgsDistributed) || 0,
        kgs_returned: parseFloat(kgsReturned) || 0,
        extra_kgs: parseFloat(extraKgs) || 0,
      };
      await createBill(billData);
      Alert.alert("Success", "Bill created successfully!");
      router.back();
    } catch (error: any) {
      Alert.alert("Error", "Failed to create bill: " + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  if (isFetchingCustomers) {
    return (
      <View style={[styles.container, { justifyContent: "center" }]}>
        <Text>Loading customers...</Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{ paddingBottom: 64 }}
    >
      <Text style={styles.label}>Customer</Text>
      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={selectedCustomerId}
          onValueChange={(itemValue) => setSelectedCustomerId(itemValue)}
          style={styles.picker}
          itemStyle={styles.pickerItem}
          mode="dropdown"
        >
          {customers.map((customer) => (
            <Picker.Item
              key={customer.id}
              label={customer.name}
              value={customer.id}
            />
          ))}
        </Picker>
      </View>

      <Text style={styles.label}>Bill Date</Text>
      <Pressable
        onPress={() => setShowDatePicker(true)}
        style={styles.dateSelector}
      >
        <Text style={styles.dateText}>{billDate.toLocaleDateString()}</Text>
      </Pressable>
      {showDatePicker && (
        <DateTimePicker
          value={billDate}
          mode="date"
          display={Platform.OS === "ios" ? "spinner" : "default"}
          onChange={onDateChange}
          maximumDate={new Date(2100, 11, 31)}
          minimumDate={new Date(2000, 0, 1)}
        />
      )}

      <Text style={styles.label}>Total Amount (₹)</Text>
      <TextInput
        style={styles.input}
        placeholder="e.g., 5000"
        value={totalAmount}
        onChangeText={setTotalAmount}
        keyboardType="numeric"
      />

      <Text style={styles.label}>KGs Distributed</Text>
      <TextInput
        style={styles.input}
        placeholder="e.g., 100"
        value={kgsDistributed}
        onChangeText={setKgsDistributed}
        keyboardType="numeric"
      />

      <Text style={styles.label}>KGs Returned</Text>
      <TextInput
        style={styles.input}
        placeholder="e.g., 10"
        value={kgsReturned}
        onChangeText={setKgsReturned}
        keyboardType="numeric"
      />

      <Text style={styles.label}>Extra KGs</Text>
      <TextInput
        style={styles.input}
        placeholder="e.g., 5"
        value={extraKgs}
        onChangeText={setExtraKgs}
        keyboardType="numeric"
      />

      <Pressable
        style={[styles.button, isLoading && styles.disabled]}
        onPress={handleSubmit}
        disabled={isLoading}
      >
        <Text style={styles.buttonText}>
          {isLoading ? "Creating..." : "Create Bill"}
        </Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 18,
    backgroundColor: "#f2f2f7",
  },
  label: {
    fontSize: 16,
    fontWeight: "500",
    color: "#222",
    padding: 4,
    marginVertical: 4,
  },
  pickerContainer: {
    backgroundColor: "#fff",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#e5e5ea",
    marginBottom: 12,
  },
  picker: {
    width: "100%",
  },
  pickerItem: {
    fontSize: 16,
    color: "#222",
  },
  dateSelector: {
    backgroundColor: "#fff",
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: "#e5e5ea",
    justifyContent: "center",
    marginBottom: 12,
  },
  dateText: {
    fontSize: 16,
    color: "#222",
  },
  input: {
    backgroundColor: "#fff",
    paddingHorizontal: 15,
    paddingVertical: 13,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#e5e5ea",
    fontSize: 16,
    marginBottom: 12,
    color: "#111",
  },
  button: {
    backgroundColor: "#007AFF",
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: "center",
    marginTop: 20,
  },
  buttonText: {
    color: "#fff",
    fontSize: 17,
  },
  disabled: {
    opacity: 0.6,
  },
});
