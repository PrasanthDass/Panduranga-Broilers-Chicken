import React from "react";
import { View, ViewProps } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type ScreenProps = ViewProps & {
  children: React.ReactNode;
  center?: boolean;
};

export default function Screen({ children, style, center, ...rest }: ScreenProps) {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View
        style={[
          { flex: 1 },
          center ? { justifyContent: "center", alignItems: "center" } : null,
          style,
        ]}
        {...rest}
      >
        {children}
      </View>
    </SafeAreaView>
  );
}


