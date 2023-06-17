import {
  FlatList,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import React, { useRef, useState } from "react";
import { PRIMARY } from "../config/config";
import { API_URL, API_KEY } from "@env";
import axios from "axios";
import Card from "../component/Card";
import { FontAwesome } from "@expo/vector-icons";
import { StatusBar } from "expo-status-bar";

const SearchScreen = () => {
  const [text, setText] = useState("");
  const [page, setPage] = useState(1);
  const [data, setData] = useState([]);
  const ref = useRef();
  const onChangeText = (e) => {
    setText(e);
    clearTimeout(ref.current);
    if (e.length < 3) return;
    ref.current = setTimeout(async () => {
      try {
        const { data } = await axios.get(`${API_URL}/search/movie`, {
          params: {
            api_key: API_KEY,
            page: 1,
            language: "en-US",
            query: e,
          },
        });
        setPage(data.page);
        setData(data.results);
      } catch (e) {
        ToastAndroid.show(e?.message, 3000);
      } finally {
        // setTimeout(() => setFetching(false), 100);
      }
    }, 500);
  };
  return (
    <ScrollView style={styles.conainer}>
      <StatusBar style={"dark"} />
      <View style={styles.inputConntainer}>
        <FontAwesome name="search" size={18} color={PRIMARY} />
        <TextInput
          placeholder="Search"
          onChangeText={onChangeText}
          value={text}
          keyboardType="web-search"
          style={{ flex: 1, color: PRIMARY }}
        />
      </View>
      <FlatList
        scrollEventThrottle={15}
        scrollEnabled={false}
        data={data}
        renderItem={({ item }) => (
          <Card
            title={item.title}
            image={item.poster_path}
            id={item.id}
            type="movie"
          />
        )}
        keyExtractor={(item) => item.id}
        numColumns={2}
        onEndReachedThreshold={0.1}
        // refreshControl={
        //   <RefreshControl
        //     refreshing={loading}
        //     onRefresh={fetchData}
        //     colors={[PRIMARY, "green"]}
        //   />
        // }
        // onEndReached={fetchMore}
        // ListFooterComponent={footer}
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}
      />
    </ScrollView>
  );
};

export default SearchScreen;

const styles = StyleSheet.create({
  conainer: {
    flex: 1,
    paddingHorizontal: 5,
  },
  inputConntainer: {
    height: 50,
    backgroundColor: "#f5f5f5",
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 100,
    paddingHorizontal: 15,
    gap: 10,
    marginHorizontal: 10,
  },
  searchText: {
    color: PRIMARY,
    fontSize: 16,
    fontWeight: 500,
  },
});
