import { ImageBackground, StyleSheet, Text, View } from "react-native";
import React, { useEffect, useState } from "react";
import axiosInstance from "../lib/axiosInstance";
import { ToastAndroid } from "react-native";
import { CARDIMAGEPATH } from "../config/config";
import { StatusBar } from "expo-status-bar";
import { LinearGradient } from "expo-linear-gradient";

const DetailScreen = ({ route: { params } }) => {
  const [data, setData] = useState(null);
  const { id, type } = params;
  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await axiosInstance.get(`/${type}/${id}`, {
          params: {
            append_to_response: "videos,credits",
          },
        });
        setData(data);
      } catch (e) {
        ToastAndroid.show(e?.message, 3000);
      } finally {
      }
    };
    fetchData();
  }, []);
  if (!data) return null;
  return (
    <View style={{ flex: 1 }}>
      <StatusBar style="inverted" />
      <ImageBackground
        style={styles.cover}
        imageStyle={{ resizeMode: "stretch" }}
        source={{ uri: `${CARDIMAGEPATH}${data.poster_path}` }}
      >
        <LinearGradient
          colors={["rgba(0,0,0,0.75)", "transparent", "rgba(255,255,255,1)"]}
          style={{
            flex: 1,
            position: "absolute",
            width: "100%",
            height: "100%",
          }}
        />
        <View style={styles.posterContainer}>
          <Text style={styles.title}>{data?.title || data?.name}</Text>
        </View>
      </ImageBackground>
    </View>
  );
};

export default DetailScreen;

const styles = StyleSheet.create({
  cover: {
    width: "100%",
    aspectRatio: 4 / 3,
    justifyContent: "flex-end",
  },
  posterContainer: {
    paddingHorizontal: 10,
  },
  title: {
    fontSize: 26,
    fontWeight: 600,
  },
});
