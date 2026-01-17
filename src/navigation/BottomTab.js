import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Image, Text, View, Platform } from "react-native";

import HomeScreen from "../home/Home";
import PracticeScreen from "../screens/PracticeScreen";
import TestsScreen from "../screens/TestsScreen";
import ProfileScreen from "../screens/ProfileScreen";

const Tab = createBottomTabNavigator();

// icon mapper
const icons = {
  Home: require("../assets/icon/home.png"),
  Practice: require("../assets/icon/practice.png"),
  Tests: require("../assets/icon/test.png"),
  Profile: require("../assets/icon/profile.png"),
};

const TabIcon = ({ focused, name }) => (
  <View style={{ alignItems: "center", justifyContent: "center" }}>
    <Image
      source={icons[name]}
      style={{
        width: 24,
        height: 24,
        resizeMode: "contain",
        tintColor: focused ? "#1F3B1F" : "#94A3B8",
        marginBottom: 2,
      }}
    />
  </View>
);

const BottomTabs = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,

        tabBarIcon: ({ focused }) => (
          <TabIcon focused={focused} name={route.name} />
        ),

        tabBarLabel: ({ focused }) => (
          <Text
            style={{
              fontSize: 11,
              fontWeight: "500",
              color: focused ? "#1F3B1F" : "#94A3B8",
            }}
          >
            {route.name}
          </Text>
        ),

        tabBarStyle: {
        height: Platform.OS === "ios" ? 88 : 72,
        paddingTop: 6,
        paddingBottom: Platform.OS === "ios" ? 28 : 12,
        borderTopWidth: 0.5,
        borderTopColor: "#E5E7EB",
        backgroundColor: "#F9FAF6",
       },

      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Practice" component={PracticeScreen} />
      <Tab.Screen name="Tests" component={TestsScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
};

export default BottomTabs;
