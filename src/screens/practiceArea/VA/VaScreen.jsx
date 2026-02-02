import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  Dimensions,
} from "react-native";
import CategoryCard from "../../../components/CategoryCard";
import { useNavigation } from "@react-navigation/native";

const { width, height } = Dimensions.get("window");

// scale functions
const scale = (size) => (width / 375) * size;
const verticalScale = (size) => (height / 812) * size;

// Dummy category details
const CATEGORY_DETAILS = {
  "Para Jumbles":
    "Reorder the sentences to form a coherent paragraph.",
  "Odd One Out":
    "Identify the word or sentence that doesn't fit the pattern.",
  "Para Summary":
    "Condense the paragraph into a meaningful summary.",
};

const VaScreen = () => {
  const navigation = useNavigation();
  const [selectedCategory, setSelectedCategory] = useState(null);

  const onBack = () => navigation.goBack();
  const onBackFromDetail = () => setSelectedCategory(null);

  // 🔹 Full-screen detail view
  if (selectedCategory) {
    return (
      <View style={styles.detailRoot}>
        <View style={styles.detailHeader}>
          <TouchableOpacity onPress={onBackFromDetail}>
            <Image
              source={require("../../../assets/icon/backbutton.png")}
              style={styles.backIcon}
            />
          </TouchableOpacity>
          <Text style={styles.detailHeaderTitle}>{selectedCategory}</Text>
        </View>

        <ScrollView
          contentContainerStyle={styles.detailContent}
          showsVerticalScrollIndicator={false}
        >
          <Text style={styles.detailText}>
            {CATEGORY_DETAILS[selectedCategory]}
          </Text>
        </ScrollView>
      </View>
    );
  }

  // 🔹 Main VA screen
  return (
    <View style={styles.root}>
      <View style={styles.stickyHeader}>
        <TouchableOpacity onPress={onBack}>
          <Image
            source={require("../../../assets/icon/backbutton.png")}
            style={styles.backIcon}
          />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>VA Practice</Text>
        <View style={styles.headerSide}>
          <View style={styles.streakBox}>
            <Text style={styles.streakIcon}>🔥</Text>
            <Text style={styles.streakText}>7</Text>
          </View>
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        {/* Stats */}
        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <Text style={styles.statLabel}>Solved</Text>
            <Text style={styles.statValue}>450</Text>
            <Text style={styles.statSub}>+12 today</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statLabel}>Accuracy</Text>
            <Text style={styles.statValue}>78%</Text>
            <Text style={styles.statSub}>Top 15%</Text>
          </View>
        </View>

        {/* Practice Categories */}
        <Text style={styles.sectionTitle}>Practice Categories</Text>
        {Object.keys(CATEGORY_DETAILS).map((cat) => (
          <TouchableOpacity
            key={cat}
            onPress={() => setSelectedCategory(cat)}
            activeOpacity={0.8}
          >
            <CategoryCard
              title={cat}
              subtitle={CATEGORY_DETAILS[cat]}
              progress={
                cat === "Para Jumbles"
                  ? "60%"
                  : cat === "Odd One Out"
                  ? "45%"
                  : "30%"
              }
            />
          </TouchableOpacity>
        ))}

        {/* Daily Focus */}
        <Text style={styles.sectionTitle}>Daily Focus</Text>
        <View style={styles.dailyCard}>
          <Text style={styles.dailyTag}>TODAY’S DRILL</Text>
          <Text style={styles.dailyTitle}>5-Min Summary Sprint</Text>
          <Text style={styles.dailyDesc}>
            High-yield paragraphs curated for CAT VARC speed & clarity.
          </Text>
          <TouchableOpacity style={styles.dailyBtn}>
            <Text style={styles.dailyBtnText}>Start Now</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

export default VaScreen;

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: "#F9FAF6" },

  stickyHeader: {
    height: 60,
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#F9FAF6",
    borderBottomWidth: 1,
    borderColor: "#E5E7EB",
  },

  headerTitle: { fontSize: 18, fontWeight: "600", color: "#1F3B1F" },
  headerSide: { width: 40, alignItems: "center" },
  streakBox: { flexDirection: "row", alignItems: "center" },
  streakIcon: { fontSize: 18, marginRight: 4 },
  streakText: { fontSize: 14, fontWeight: "600", color: "#1F3B1F" },

  content: { padding: 20, paddingBottom: 40 },
  statsRow: { flexDirection: "row", justifyContent: "space-between", marginBottom: 20 },
  statCard: { backgroundColor: "#1F3B1F", width: "49%", borderRadius: 16, padding: 16 },
  statLabel: { fontSize: 13, color: "#fff" },
  statValue: { fontSize: 26, fontWeight: "600", color: "#fff", marginVertical: 6 },
  statSub: { fontSize: 13, color: "#E5E7EB", fontWeight: "500" },

  sectionTitle: { fontSize: 18, fontWeight: "600", color: "#1F3B1F", marginBottom: 12, marginTop: 10 },

  dailyCard: { backgroundColor: "#EEF4EE", borderRadius: 20, padding: 18, marginBottom: 30, borderLeftWidth: 4, borderLeftColor: "#1F3B1F" },
  dailyTag: { fontSize: 12, fontWeight: "600", color: "#1F3B1F", marginBottom: 6 },
  dailyTitle: { fontSize: 18, fontWeight: "600", color: "#1F3B1F", marginBottom: 6 },
  dailyDesc: { fontSize: 14, color: "#374151", marginBottom: 14, lineHeight: 20 },
  dailyBtn: { backgroundColor: "#1F3B1F", paddingVertical: 12, borderRadius: 12, alignItems: "center" },
  dailyBtnText: { color: "#FFFFFF", fontWeight: "600", fontSize: 15 },

  backIcon: { width: scale(22), height: scale(22), tintColor: "#1F3B1F" },

  // Detail Screen
  detailRoot: { flex: 1, backgroundColor: "#FFFFFF" },
  detailHeader: {
    height: 60,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderColor: "#E5E7EB",
  },
  detailHeaderTitle: { fontSize: 18, fontWeight: "600", color: "#1F3B1F", marginLeft: 16 },
  detailContent: { padding: 20, paddingBottom: 40 },
  detailText: { fontSize: scale(16), lineHeight: verticalScale(28), color: "#0F172A" },
});
