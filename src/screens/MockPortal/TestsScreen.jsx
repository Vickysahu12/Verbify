import React from "react";
import { View, Text, StyleSheet } from "react-native";

const TestScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>TestsScreen is on the way</Text>
    </View>
  );
};

export default TestScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  text: {
    fontSize: 18,
    fontWeight: "600",
    color:"#000"
  },
});
