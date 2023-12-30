import { StatusBar } from "expo-status-bar";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Dimensions,
  ActivityIndicator,
} from "react-native";
import React, { useState, useEffect } from "react";
import * as Location from "expo-location";
import { Fontisto } from "@expo/vector-icons";

const API_KEY = "4cbb0083ff582a2852615efb78883ddb";

const icons = {
  Clear: "day-sunny",
  Clouds: "cloudy",
  Rain: "rain",
  Atmosphere: "cloudy-gusts",
  Snow: "snow",
  Drizzle: "day-rain",
  Thunderstorm: "lightning",
};

const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;
export default function App() {
  const [city, setCity] = useState("loading...");
  const [days, setDays] = useState([]);
  const [ok, setOk] = useState(true);

  const getWeather = async () => {
    const { granted } = await Location.requestForegroundPermissionsAsync();
    if (!granted) {
      setOk(false);
    }
    const {
      coords: { latitude, longitude },
    } = await Location.getCurrentPositionAsync({ accuracy: 5 });
    const location = await Location.reverseGeocodeAsync(
      {
        latitude,
        longitude,
      },
      { useGoogleMaps: false }
    );

    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&appid=${API_KEY}&units=metric`
    );
    const { list } = await response.json();
    // console.log(list);

    const filterd_list = list.filter((weather) => {
      if (weather.dt_txt.includes("00:00:00")) {
        return weather;
      }
    });
    // console.log(filterd_list);
    // console.log(days);

    // console.log(location);
    // console.log(location[0].city);
    setCity(location[0].city);
  };
  useEffect(() => {
    getWeather();
  }, []);
  console.log(days);
  return (
    <View style={styles.container}>
      <StatusBar style={styles.statusBar} />
      <View style={styles.city}>
        <Text style={styles.cityName}>{city}</Text>
      </View>

      <ScrollView
        contentContainerStyle={styles.weather}
        showsHorizontalScrollIndicator={false}
        horizontal
        pagingEnabled
      >
        {days.length === 0 ? (
          <View style={{ ...styles.day, alignItems: "center" }}>
            <ActivityIndicator
              size="large"
              color="white"
              style={{ marginTop: 10 }}
            />
          </View>
        ) : (
          days.map((day, index) => (
            <View key={index} style={styles.day}>
              <Text style={styles.date}>
                {new Date(day.dt * 1000).toDateString()}
              </Text>
              <View style={styles.main}>
                <Text style={styles.temp}>
                  {parseFloat(day.main.temp).toFixed(1)}
                </Text>
                <Fontisto
                  name={icons[day.weather[0].main]}
                  size={68}
                  color="black"
                />
              </View>

              <Text style={styles.description}>{day.weather[0].main}</Text>
              <Text style={styles.tinyText}>{day.weather[0].description}</Text>
            </View>
          ))
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "tomato",
  },
  statusBar: {},
  city: {
    flex: 1.2,
    justifyContent: "center",
    alignItems: "center",
  },
  cityName: {
    color: "black",
    fontSize: 68,
    fontWeight: "500",
    color: "white",
  },
  weather: {},

  day: {
    width: windowWidth,
    alignItems: "flex-start",
  },
  date: {
    fontSize: 30,
    color: "white",
  },
  main: {
    width: "100%",
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
  },
  temp: {
    marginTop: 50,
    fontSize: 120,
    color: "white",
  },
  description: {
    fontSize: 35,
    marginTop: -30,
    color: "white",
  },
  tinyText: {
    fontSize: 20,
    color: "white",
  },
});
