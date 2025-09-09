import { styles } from "@/app/style/styles";
import { Image, Pressable, Text, TextInput, View } from "react-native";

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
        source={require("@/assets/images/icon.png")}
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
          <Text style={styles.pressable_text}>Login</Text>
        </Pressable>
      </View>
    </View>
  );
}
