import { Link } from "expo-router";
import { Image, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Navbar from "./components/Navbar";

export default function Index() {
  return (
    <SafeAreaView
      style={{
        flex: 1,
      }}
    >
      <Navbar />
      <ScrollView
        contentContainerStyle={{
          alignItems: "center",
        }}
      ></ScrollView>
    </SafeAreaView>
  );
}
