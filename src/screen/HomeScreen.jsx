import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useCallback, useEffect, useState } from "react";
import Card from "../component/Card";
import { PRIMARY } from "../config/config";
import * as SplashScreen from "expo-splash-screen";
import { FontAwesome } from "@expo/vector-icons";
import HeroComponent from "../component/HeroComponent";
import axiosInstance from "../lib/axiosInstance";
import Language from "../component/Language";
import Section from "../component/Section";
import Sheet from "../component/Sheet";

// Keep the splash screen visible while we fetch resources
// SplashScreen.preventAutoHideAsync();

const HomeScreen = ({ navigation }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [fetching, setFetching] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPage, setTotalPage] = useState(1);
  const [appIsReady, setAppIsReady] = useState(false);
  const fetchData = async () => {
    setLoading(true);
    try {
      const { data } = await axiosInstance.get(`/discover/movie`, {
        params: {
          page: 1,
          // with_original_language: "mr|hi",
          sort_by: "release_date.desc",
        },
      });
      setPage(data.page);
      setTotalPage(data?.total_pages);
      setData(data?.results);
    } catch (e) {
      console.log(e?.message);
    } finally {
      setLoading(false);
      setAppIsReady(true);
    }
  };
  const fetchMore = async () => {
    if (!loading && page < totalPage && !fetching) {
      setFetching(true);
      try {
        const { data } = await axiosInstance.get(`/discover/movie`, {
          params: {
            page: page + 1,
            with_original_language: "mr|hi",
          },
        });
        setPage(data.page);
        setData((prev) => [...prev, ...data?.results]);
      } catch (e) {
        console.log(e?.message);
      } finally {
        setTimeout(() => setFetching(false), 100);
      }
    }
  };

  const onLayoutRootView = useCallback(async () => {
    if (appIsReady) {
      // This tells the splash screen to hide immediately! If we call this after
      // `setAppIsReady`, then we may see a blank screen while the app is
      // loading its initial state and rendering its first pixels. So instead,
      // we hide the splash screen once we know the root view has already
      // performed layout.
      await SplashScreen.hideAsync();
    }
  }, [appIsReady]);

  const footer = () => {
    if (fetching) return <ActivityIndicator color={PRIMARY} size="large" />;
    return null;
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (!appIsReady) {
    return null;
  }
  return (
    <ScrollView
      onEndReachedThreshold={0.1}
      refreshControl={
        <RefreshControl
          refreshing={loading}
          onRefresh={fetchData}
          colors={[PRIMARY, "green"]}
        />
      }
      scrollEventThrottle={15}
      onEndReached={fetchMore}
      ListFooterComponent={footer}
      showsVerticalScrollIndicator={false}
      showsHorizontalScrollIndicator={false}
      style={{ flex: 1 }}
      onLayout={onLayoutRootView}
    >
      <TouchableOpacity
        onPress={() => {
          navigation.navigate("Search");
        }}
        style={styles.search}
      >
        <FontAwesome name="search" size={20} color={PRIMARY} />
        <Text style={styles.searchText}>Search</Text>
      </TouchableOpacity>
      <Language />
      <HeroComponent url={"/movie/popular"} type="movie" />
      <Section
        title={"Now Playing Movie"}
        type="movie"
        url={"/movie/now_playing"}
      />
      <Section title={"Discover Movies"} type="movie" url={"/discover/movie"} />
      <Section
        title={"Top Rated Movies"}
        type="movie"
        url={"/movie/top_rated"}
      />
      <Section title={"Top Rated Movies"} type="movie" url={"/tv/top_rated"} />
      <Section
        title={"Trending Movie"}
        type="movie"
        url={"/trending/movie/week"}
      />
      <Section title={"Upcoming Movie"} type="movie" url={"/movie/upcoming"} />
      <Section title={"Discover Tv Shows"} type="tv" url={"/discover/tv"} />
      <Section title={"Popular TV Shows"} type="tv" url={"/tv/popular"} />
      <Section
        title={"Trending TV Shows"}
        type="tv"
        url={"/trending/tv/week"}
      />
      {/* <FlatList
        data={data}
        horizontal
        renderItem={({ item }) => (
          <Card
            title={item.title}
            image={item.poster_path}
            id={item.id}
            type="movie"
          />
        )}
        keyExtractor={(item) => item.id}
        showsHorizontalScrollIndicator={false}
        // numColumns={2}
      /> */}
    </ScrollView>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  search: {
    height: 50,
    borderRadius: 100,
    marginHorizontal: 15,
    alignItems: "center",
    paddingLeft: 20,
    gap: 10,
    flexDirection: "row",
    marginBottom: 10,
    backgroundColor: "#f5f5f5",
  },
  searchText: {
    color: PRIMARY,
    fontSize: 16,
    fontWeight: 500,
  },
});
