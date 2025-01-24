import React, { useCallback, useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { useUser } from "../utils/UserContext";
import PlantCard from "../Components/PlantCard";
import WeatherComponent from "../Components/WeatherComponent";

const HomeScreen = ({ navigation }) => {
  const { user, refreshUser, loading } = useUser();
  const [hasRefreshed, setHasRefreshed] = useState(false);

  // Reset hasRefreshed when screen loses focus
  useFocusEffect(
    useCallback(() => {
      return () => {
        setHasRefreshed(false);
      };
    }, [])
  );

  // Handle the one-time refresh when screen is focused
  useFocusEffect(
    useCallback(() => {
      if (!hasRefreshed) {
        const timer = setTimeout(() => {
          refreshUser(true);
          setHasRefreshed(true);
        }, 1000);

        return () => clearTimeout(timer);
      }
    }, [hasRefreshed, refreshUser])
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  const handleManualRefresh = () => {
    refreshUser(true);
    setHasRefreshed(true);
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#ffff" }}>
      <FlatList
        data={user?.plants || []}
        ListHeaderComponent={
          <>
            <WeatherComponent />

            <View style={styles.my_plants_container}>
              <View></View>
              <Text style={styles.my_plants}>My Plants</Text>
              <View style={styles.iconContainer}>
                <TouchableOpacity
                  onPress={handleManualRefresh}
                  style={[{ zIndex: 1 }, { marginRight: 20 }]}
                >
                  <Image
                    source={require("../assets/refresh.png")}
                    style={styles.inputIconCalendar}
                  />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => navigation.navigate("Settings")}
                >
                  <Image
                    source={require("../assets/setting.png")}
                    style={[styles.inputIconCalendar, { marginRight: 25 }]}
                  />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => navigation.navigate("Create Plant")}
                  style={{ zIndex: 1 }}
                >
                  <Image
                    source={require("../assets/leaf.png")}
                    style={styles.inputIconCalendar}
                  />
                </TouchableOpacity>
              </View>
            </View>
          </>
        }
        renderItem={({ item }) => (
          <PlantCard
            style={{ marginBottom: 20 }}
            navigation={navigation}
            plant={item}
          />
        )}
        keyExtractor={(item) => item._id}
        numColumns={2}
        ListFooterComponent={<View style={{ marginBottom: 110 }}></View>}
      />
    </View>
  );
};
const styles = StyleSheet.create({
  my_plants: {
    fontSize: 30,
    fontFamily: "Montserrat_SemiBold",
  },
  my_plants_container: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 60,
    marginLeft: 14,
  },
  inputIconCalendar: {
    width: 25,
    height: 25,
    marginLeft: 10,
  },
  inputIcon: {
    width: 20,
    height: 20,
  },
  iconContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginLeft: 50,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  my_plants: {
    fontSize: 30,
    fontFamily: "Montserrat_SemiBold",
  },
  my_plants_container: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 60,
    marginLeft: 14,
  },
  inputIconCalendar: {
    width: 25,
    height: 25,
    marginLeft: 10,
  },
  inputIcon: {
    width: 20,
    height: 20,
  },
  iconContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginLeft: 50,
  },
});
export default HomeScreen;
