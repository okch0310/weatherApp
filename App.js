import React, { useState, useEffect } from "react";
import { StatusBar } from "expo-status-bar";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Dimensions,
  ActivityIndicator,
} from "react-native";
//import { useEffect, useState } from "react/cjs/react.production.min";
import * as Location from "expo-location";

import { Fontisto } from "@expo/vector-icons";

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const API_KEY = "2cb33d3970e7a59489b3a5ad2d63fe8a";

const icons = {
  Clear: "day-sunny",

  Clouds: "cloudy",
  Rain: "rain",
  Atmosphere: "cloudy-gusts",
  Snow: "snow",
  Drizzle: "day-rain",
  Thunderstorm: "lightning",
};
console.log(SCREEN_WIDTH);
export default function App() {
  const [city, setCity] = useState("Loading...");
  const [loc1, setLoc1] = useState("");
  const [loc2, setLoc2] = useState("");
  const [days, setDays] = useState([]);
  const [ok, setOk] = useState(true);
  const getWeather = async () => {
    const { granted } = await Location.requestForegroundPermissionsAsync();
    //console.log(permission);
    if (!granted) {
      setOk(false);
    }

    const {
      coords: { longitude, latitude },
    } = await Location.getCurrentPositionAsync({ accuracy: 5 });
    //console.log(location);
    const location = await Location.reverseGeocodeAsync(
      {
        latitude,
        longitude,
      },
      { useGoogleMaps: false }
    );
    console.log(location[0]);
    setLoc2(location[0].country);
    setLoc1(location[0].name);
    setCity(location[0].city);
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/onecall?lat=${latitude}&lon=${longitude}&exclude=alerts&appid=${API_KEY}&units=metric`
    );
    const json = await response.json();
    setDays(json.daily);
  };

  useEffect(() => {
    getWeather();
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar style="black" />
      <View style={styles.city}>
        <Text
          style={{
            fontSize: 30,
            fontWeight: "500",
            marginTop: 55,
            marginBottom: 10,
          }}
        >
          채현이는 지금 ...
        </Text>
        <Text style={styles.cityName}>
          {city} {loc1}
        </Text>
      </View>
      <ScrollView
        pagingEnabled
        showsHorizontalScrollIndicator="false"
        horizontal
        contentContainerStyle={styles.weather}
      >
        {days.length === 0 ? (
          <View style={styles.day}>
            <ActivityIndicator
              color="white"
              size="large"
              style={{ marginTop: 30 }}
            />
          </View>
        ) : (
          days.map((day, index) => (
            <View key={index} style={styles.day}>
              <Text style={styles.date}>
                {new Date(day.dt * 1000).toString().substring(0, 10)}
              </Text>
              <View
                style={{
                  marginTop: 50,
                }}
              >
                <Fontisto
                  name={icons[day.weather[0].main]}
                  size={70}
                  color="black"
                />
              </View>
              <View>
                <Text style={styles.temperature}>
                  {parseFloat(day.temp.day).toFixed(1)}
                </Text>
              </View>

              <Text style={styles.discription}>{day.weather[0].main}</Text>
              <Text style={styles.tiny}>{day.weather[0].description}</Text>
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
    backgroundColor: "#ff748c",
  },
  city: {
    flex: 1,
    //backgroundColor: "blue",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 70,
  },
  cityName: {
    fontSize: 70,
    fontWeight: "500",
  },
  weather: {
    //backgroundColor: "teal",
  },
  day: {
    //flex: 1,
    //justifyContent: "center",
    width: SCREEN_WIDTH,
    alignItems: "center",
    //backgroundColor: "teal",
  },
  temperature: {
    marginTop: -20,
    fontSize: 190,
  },
  discription: {
    fontSize: 60,
    marginTop: -30,
  },
  tiny: {
    fontSize: 20,
  },
  date: {
    marginTop: 100,
    fontSize: 30,
    marginBottom: -30,
    fontWeight: "500",
  },
});
