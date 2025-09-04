import {
  View,
  Text,
  Image,
  TextInput,
  StyleSheet,
  Pressable,
} from "react-native";

export default function Login() {
  const whilePressIn = () => {
    console.log("Pressed in");
  };
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
      }}
    >
      <Image
        source={require("../assets/images/icon.png")}
        style={styles.image}
      />
      <View style={styles.form}>
        <Text style={styles.label}>Name</Text>
        <TextInput style={styles.input}></TextInput>
        <Text style={styles.label}>Password</Text>
        <TextInput style={styles.input}></TextInput>
        <Pressable
          style={({ pressed }) => [styles.pressable, pressed && styles.focus]}
          onPressIn={whilePressIn}
          onPress={() => {}}
        >
          <Text style={styles.text}>Login</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  input: {
    height: 50,
    borderColor: "gray",
    borderWidth: 1,
    marginBottom: 10,
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 10,
    width: "80%",
  },
  label: {
    fontSize: 12,
    textAlign: "left",
    alignSelf: "flex-start",
    marginLeft: "10%",
    fontWeight: "300",
    userSelect: "none",
  },
  image: {
    width: 100,
    height: 100,
    marginBottom: 20,
    alignSelf: "center",
  },
  form: {
    alignItems: "center",
    justifyContent: "center",
    gap: 5,
  },
  text: {
    color: "white",
  },
  pressable: {
    backgroundColor: "purple",
    opacity: 0.75,
    padding: 10,
    borderRadius: 10,
    width: "80%",
    height: 50,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 10,
    fontWeight: "200",
    cursor: "pointer",
    userSelect: "none",
    elevation: 10,
  },
  focus: {
    opacity: 0.6,
    transform: [{ scale: 0.98 }],
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    transitionDuration: "100ms",
  },
});
