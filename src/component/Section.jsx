import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";
import axiosInstance from "../lib/axiosInstance";
import { useData } from "../context/DataProvider";
import { CARDIMAGEPATH, PRIMARY } from "../config/config";
import { MaterialIcons } from "@expo/vector-icons";
import axios from "axios";
import { useNavigation } from "@react-navigation/native";

const Section = ({ url, title, type }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const { languages } = useData();
  const navigation = useNavigation();
  const press = (id, type) => () => {
    navigation.navigate("Detail", {
      id,
      type,
    });
  };
  useEffect(() => {
    const source = axios.CancelToken.source();
    const fetchData = async () => {
      setLoading(true);
      try {
        const { data } = await axiosInstance.get(url, {
          params: {
            page: 1,
            with_original_language: languages
              .filter((x) => Boolean(x.select))
              .map((x) => x.value)
              .join("|"),
            sort_by: "release_date.desc",
          },
          cancelToken: source.token,
        });
        setData(data?.results);
      } catch (e) {
        ToastAndroid.show(e?.message, 3000);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
    return () => {
      source.cancel();
    };
  }, [languages]);

  if (!data.length) return null;
  return (
    <View style={{ marginVertical: 3 }}>
      <View style={styles.topContainer}>
        <View style={{ flexDirection: "row", marginLeft: 7, gap: 5 }}>
          <MaterialIcons
            name={type === "tv" ? "live-tv" : "local-movies"}
            size={24}
            color="black"
          />
          <Text style={styles.title}>{title}</Text>
        </View>
        <TouchableOpacity
          style={{ flexDirection: "row", alignItems: "center" }}
          onPress={() => {}}
        >
          <Text style={{ color: PRIMARY }}>See More</Text>
          <MaterialIcons
            name="keyboard-arrow-right"
            size={30}
            color={PRIMARY}
          />
        </TouchableOpacity>
      </View>
      <FlatList
        data={data}
        horizontal
        renderItem={({ item }) => (
          <TouchableOpacity onPress={press(item.id, type)} style={styles.card}>
            <Image
              source={
                item?.poster_path
                  ? { uri: `${CARDIMAGEPATH}${item.poster_path}` }
                  : require("../assets/noPoster.jpg")
              }
              style={styles.image}
            />
            <Text>{item?.title || item?.name}</Text>
          </TouchableOpacity>
        )}
        keyExtractor={(item) => item.id}
        showsHorizontalScrollIndicator={false}
        // numColumns={2}
      />
    </View>
  );
};

export default Section;

const styles = StyleSheet.create({
  card: {
    padding: 7,
    width: 210,
    // backgroundColor: "#d5d5d5",
    marginHorizontal: 5,
    borderRadius: 10,
    // flex: 1,
    borderWidth: 1,
    borderColor: "#d5d5d5",
  },
  topContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 5,
  },
  title: {
    fontSize: 20,
    fontWeight: 600,
  },
  image: {
    height: 300,
    borderRadius: 10,
    width: "100%",
  },
});
