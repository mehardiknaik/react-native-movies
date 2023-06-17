import { StatusBar } from "expo-status-bar";
import {
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import HomeScreen from "./src/screen/HomeScreen";
import SearchScreen from "./src/screen/SearchScreen";
import { PRIMARY } from "./src/config/config";
import { FontAwesome } from "@expo/vector-icons";
import DetailScreen from "./src/screen/DetailScreen";
import { DataProvider } from "./src/context/DataProvider";
import Sheet from "./src/component/Sheet";

const Stack = createNativeStackNavigator();
export default function App() {
  return (
    <DataProvider>
      <NavigationContainer linking={linking}>
        <Stack.Navigator
          screenOptions={({ navigation }) => ({
            headerStyle: {
              backgroundColor: "white",
            },
            headerShadowVisible: false,
            headerTintColor: PRIMARY,
            headerRight: ({ tintColor }) => (
              <Pressable
                onPress={() => {
                  navigation.navigate("Search");
                }}
                title="Search"
                android_ripple={{
                  color: "#00000077",
                  borderless: true,
                  radius: 20,
                }}
              >
                <FontAwesome name="search" size={20} color={tintColor} />
              </Pressable>
            ),
            contentStyle: {
              backgroundColor: "white",
            },
          })}
          initialRouteName="Home"
        >
          <Stack.Group
            screenOptions={{
              headerRight: null,
            }}
          >
            <Stack.Screen name="Home" component={HomeScreen} />
            <Stack.Screen name="Search" component={SearchScreen} />
          </Stack.Group>

          <Stack.Screen
            name="Detail"
            options={{
              presentation: "modal",
              headerShown: true,
              headerTransparent: true,
              headerTitle: "",
              headerStyle: {
                backgroundColor: "transparent",
              },
              headerTintColor: "white",
            }}
            component={DetailScreen}
          />
        </Stack.Navigator>
      </NavigationContainer>
      <StatusBar style={"dark"} />
    </DataProvider>
  );
}

const linking = {
  config: {
    screens: {
      Home: "",
      Detail: "/detail/:type/:id",
      Search: "/search",
    },
  },
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
