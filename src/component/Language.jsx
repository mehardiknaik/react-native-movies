import {
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useRef, useState } from "react";
import { useData } from "../context/DataProvider";
import { PRIMARY } from "../config/config";

const Language = () => {
  const { languages, dispatch } = useData();
  const [language, setLanguage] = useState(languages);
  const timerRef = useRef();
  const onPress = (id) => () => {
    clearTimeout(timerRef.current);
    setLanguage((prev) => {
      const d = prev.map((x) =>
        x.value === id ? { ...x, select: !Boolean(x.select) } : x
      );
      timerRef.current = setTimeout(() => {
        dispatch({ type: "language", payload: d });
      }, 500);
      return d;
    });
  };
  return (
    <View style={{ marginBottom: 10 }}>
      <FlatList
        data={language}
        horizontal
        renderItem={({ item }) => (
          <Pressable
            style={[styles.chip, item?.select && styles.selected]}
            onPress={onPress(item.value)}
          >
            <Text>{item.name}</Text>
          </Pressable>
        )}
        keyExtractor={(item) => item.name}
        showsHorizontalScrollIndicator={false}
      />
    </View>
  );
};

export default Language;

const styles = StyleSheet.create({
  chip: {
    marginHorizontal: 5,
    borderRadius: 30,
    borderWidth: 2,
    padding: 10,
    borderColor: "#eee",
  },
  selected: {
    backgroundColor: `${PRIMARY}55`,
    borderColor: `${PRIMARY}55`,
  },
});
