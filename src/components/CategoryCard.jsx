import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

const CategoryCard = ({ title, subtitle, progress }) => {
  return (
    <View style={styles.card}>
      {/* LEFT – Progress */}
      <View style={styles.progressWrap}>
        <View style={styles.progressCircle}>
          <Text style={styles.progressText}>{progress}</Text>
        </View>
      </View>

      {/* CENTER – Text */}
      <View style={styles.textWrap}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.sub}>{subtitle}</Text>
      </View>

      {/* RIGHT – Button */}
      <TouchableOpacity style={styles.btn}>
        <Text style={styles.btnText}>Practice</Text>
      </TouchableOpacity>
    </View>
  );
};

export default CategoryCard;

const styles = StyleSheet.create({
  card: {
    width: "100%",               // ✅ full width on all phones
    backgroundColor: "#EEF4EE",
    borderRadius: 18,
    padding: 16,
    marginBottom: 14,
    flexDirection: "row",
    alignItems: "center",
  },

  /* Progress */
  progressWrap: {
    marginRight: 14,
  },

  progressCircle: {
    width: 52,
    height: 52,
    borderRadius: 26,
    borderWidth: 4,
    borderColor: "#1F3B1F",
    justifyContent: "center",
    alignItems: "center",
  },

  progressText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#1F3B1F",
  },

  /* Text */
  textWrap: {
    flex: 1,                     // ✅ auto adjust for all screens
    paddingRight: 10,
  },

  title: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1F3B1F",
  },

  sub: {
    fontSize: 13,
    color: "#6B7280",
    marginTop: 4,
  },

  /* Button */
  btn: {
    backgroundColor: "#1F3B1F",
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 12,
  },

  btnText: {
    color: "#FFFFFF",
    fontWeight: "600",
    fontSize: 13,
  },
});
