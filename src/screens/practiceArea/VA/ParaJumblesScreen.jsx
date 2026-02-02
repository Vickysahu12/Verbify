import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

const CategoryDetailScreen = ({ category, onBack }) => {
  return (
    <View style={styles.root}>
      {/* Sticky header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack}>
          <Text style={styles.backBtn}>←</Text>
        </TouchableOpacity>
        <Text style={styles.title}>{category}</Text>
      </View>

      <View style={styles.content}>
        <Text>Yaha {category} ka full content aayega 😎</Text>
      </View>
    </View>
  );
};

export default CategoryDetailScreen;

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: "#F9FAF6" },
  header: { flexDirection: "row", alignItems: "center", padding: 16 },
  backBtn: { fontSize: 22, marginRight: 16 },
  title: { fontSize: 18, fontWeight: "600" },
  content: { flex: 1, padding: 16 },
});
