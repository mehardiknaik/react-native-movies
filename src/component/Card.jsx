import {
  Image,
  Pressable,
  StyleSheet,
  Text,
  TouchableHighlight,
  TouchableOpacity,
  View,
} from "react-native";
import React, { memo } from "react";
import { CARDIMAGEPATH } from "../config/config";
import { useNavigation } from "@react-navigation/native";

const Card = ({ title, image, id, type }) => {
  const navigation = useNavigation();
  const press = () => {
    navigation.navigate("Detail", {
      id,
      type,
    });
  };
  return (
    <TouchableHighlight
      underlayColor="#DDDDDD"
      style={styles.container}
      onPress={press}
    >
      <View>
        <View style={styles.imageContainer}>
          <Image
            source={
              image
                ? { uri: `${CARDIMAGEPATH}${image}` }
                : require("../assets/noPoster.jpg")
            }
            style={styles.image}
          />
        </View>
        <View style={styles.card}>
          <Text style={styles.title}>{title}</Text>
        </View>
      </View>
    </TouchableHighlight>
  );
};

export default memo(Card);

const styles = StyleSheet.create({
  container: {
    borderRadius: 10,
    marginVertical: 5,
    flex: 1,
  },
  imageContainer: {
    aspectRatio: 4 / 5,
    elevation: 10,
    alignItems: "center",
    // width: 200,
  },
  image: {
    height: "100%",
    borderRadius: 10,
    width: "80%",
  },
  card: {
    backgroundColor: "#ffcab9",
    elevation: 3,
    padding: 10,
    marginHorizontal: 5,
    padding: 5,
    zIndex: -1,
    marginTop: -50,
    paddingTop: 60,
    borderRadius: 10,
  },
  title: {
    fontSize: 15,
    fontWeight: "600",
  },
});
