import React from "react";
import { View, Text, StyleSheet } from "react-native";

type Props = {
  title: string;
  value: string;
};

export const StatCard = ({ title, value }: Props) => (
  <View style={styles.card}>
    <Text style={styles.title}>{title}</Text>
    <Text style={styles.value}>{value}</Text>
  </View>
);

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 12,
    marginVertical: 8,
    elevation: 3,
  },
  title: {
    fontSize: 15,
    color: "#666",
  },
  value: {
    fontSize: 20,
    fontWeight: "bold",
    marginTop: 4,
    color: "#007AFF",
  },
});

export default StatCard;
