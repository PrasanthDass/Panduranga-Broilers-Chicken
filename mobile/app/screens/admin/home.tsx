import DateDropdown from "@/app/components/DateDropDown";
import { styles } from "@/app/style/styles";
import React, { useState } from "react";
import { Pressable, ScrollView, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const enhancedDummyData = [
  { label: "Apple", value: "apple", disabled: false },
  { label: "Banana", value: "banana", disabled: false },
  { label: "Cherry", value: "cherry", disabled: true },
  { label: "Date", value: "date", disabled: false },
  { label: "Elderberry", value: "elderberry", disabled: false },
];

export default function Home() {
  const [selectedItem, setSelectedItem] = useState<{
    label: string;
    value: string;
  } | null>(null);

  const handleSelect = (item: { label: string; value: string }) => {
    setSelectedItem(item);
  };
  return (
    <SafeAreaView>
      <ScrollView style={styles.container}>
        <View style={styles.card}>
          <Pressable>*</Pressable>
          <DateDropdown />
          {/* <Dropdown */}
          {/*   label={selectedItem ? selectedItem.label : "Select a fruit"} */}
          {/*   data={enhancedDummyData} */}
          {/*   onSelect={handleSelect} */}
          {/* /> */}
          {/* {selectedItem && ( */}
          {/*   <Text style={{ marginTop: 20 }}> */}
          {/*     Selected: {selectedItem.label} ({selectedItem.value}) */}
          {/*   </Text> */}
          {/* )} */}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
