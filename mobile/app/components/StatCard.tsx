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
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  title: {
    fontSize: 16,
    color: "#666",
  },
  value: {
    fontSize: 28,
    fontWeight: "bold",
    marginTop: 4,
  },
});

export default StatCard;
