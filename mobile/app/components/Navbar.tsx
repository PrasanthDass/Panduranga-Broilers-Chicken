import { Link } from "expo-router";
import { View, StyleSheet } from "react-native";

const styles = StyleSheet.create({
  link: {
    fontSize: 12,
    fontWeight: "400",
    padding: 10,
    margin: 10,
    borderRadius: 10,
    position: "absolute",
    backgroundColor: "#DDDDDD",
  },
  pressable: {
    backgroundColor: "#007AFF",
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 10,
    marginTop: 10,
    width: "80%",
  },
  focus: {
    backgroundColor: "#005BBB",
  },
  text: {
    color: "white",
    textAlign: "center",
  },
});
export default function Navbar() {
  return (
    <View>
      <Link style={styles.link} href="/login">
        Login
      </Link>
    </View>
  );
}
