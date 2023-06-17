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
import { Dimensions } from "react-native";
import { CARDIMAGEPATH, PRIMARY } from "../config/config";
import { MaterialIcons } from "@expo/vector-icons";
import randomColor from "randomcolor";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { useData } from "../context/DataProvider";
import axios from "axios";

const { width } = Dimensions.get("window");

const HeroComponent = ({ url }) => {
  const [data, setData] = useState([]);
  const navigation = useNavigation();
  const { languages } = useData();
  const press = (id, type) => () => {
    navigation.navigate("Detail", {
      id,
      type,
    });
  };
  useEffect(() => {
    const source = axios.CancelToken.source();
    const getData = async () => {
      try {
        const { data } = await axiosInstance.get(url, {
          params: {
            with_original_language: languages
              .filter((x) => Boolean(x.select))
              .map((x) => x.value)
              .join("|"),
          },
          cancelToken: source.token,
        });
        setData(data.results);
      } catch (e) {
        console.log(e);
      }
    };
    getData();
    return () => {
      source.cancel();
    };
  }, [languages]);
  return (
    <FlatList
      data={data}
      horizontal
      renderItem={({ item }) => (
        <TouchableOpacity onPress={press(item.id, "movie")}>
          <View style={styles.container}>
            <View style={styles.imageContainer}>
              <Image
                source={
                  item?.poster_path
                    ? { uri: `${CARDIMAGEPATH}${item.poster_path}` }
                    : require("../assets/noPoster.jpg")
                }
                style={styles.image}
              />
              <View style={styles.language}>
                <Text style={{ color: "white", textTransform: "capitalize" }}>
                  {item?.original_language}
                </Text>
              </View>
            </View>
            <View style={styles.card}>
              <Text style={styles.titleText}>{item.title}</Text>
              <View style={styles.rate}>
                {!!item?.vote_average && (
                  <Text style={{ fontSize: 19 }}>
                    <Ionicons name="star" size={17} color="gold" />{" "}
                    {item?.vote_average}
                  </Text>
                )}
                <Text>{item?.release_date}</Text>
              </View>
              <Text>{item.overview.slice(0, 100)}...</Text>
            </View>
          </View>
        </TouchableOpacity>
      )}
      pagingEnabled
      keyExtractor={(item) => item.id}
      showsHorizontalScrollIndicator={false}
      ListFooterComponent={() => (
        <View style={styles.viewAllContainer}>
          <Text style={{ color: PRIMARY }}>View All</Text>
          <MaterialIcons
            name="keyboard-arrow-right"
            size={30}
            color={PRIMARY}
          />
        </View>
      )}
    />
  );
};

export default HeroComponent;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width,
    alignItems: "flex-end",
    position: "relative",
    height: 250,
    justifyContent: "flex-end",
    padding: 5,
  },
  imageContainer: {
    position: "absolute",
    left: 5,
    top: 0,
    height: "100%",
    width: 140,
    // elevation: 10,
  },
  image: {
    flex: 1,
    aspectRatio: 2 / 3,
    borderRadius: 10,
    borderColor: "white",
    borderWidth: 2,
    resizeMode: "contain",
  },
  language: {
    padding: 4,
    backgroundColor: PRIMARY,
    alignSelf: "center",
    borderRadius: 50,
    minWidth: 50,
    alignItems: "center",
    marginTop: -10,
    borderColor: "white",
    borderWidth: 2,
  },
  card: {
    width: "85%",
    height: "90%",
    borderRadius: 10,
    padding: 10,
    zIndex: -1,
    backgroundColor: "#d5d5d5",
    paddingLeft: 95,
    // elevation: 6,
  },
  titleText: {
    fontSize: 16,
    fontWeight: 600,
    marginBottom: 4,
  },
  viewAllContainer: {
    width: width * 0.5,
    flex: 1,
    backgroundColor: "#d5d5d5",
    elevation: 6,
    margin: 8,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
  },
  rate: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
});
