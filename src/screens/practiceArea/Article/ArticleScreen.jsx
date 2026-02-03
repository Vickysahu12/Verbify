import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  Image,
  Dimensions,
} from "react-native";

const { width, height } = Dimensions.get("window");

// Scaling functions
const scale = (size) => (width / 375) * size;
const verticalScale = (size) => (height / 812) * size;

const CATEGORIES = ["All", "Philosophy", "Science", "Society", "Psychology"];

const ARTICLES = [
  {
    id: 1,
    category: "Philosophy",
    title: "Is Free Will an Illusion?",
    summary:
      "Philosophers have long debated whether human actions are truly free or merely the result of prior causes.",
    readTime: "12 min read",
    author: "Daniel C. Dennett",
    coverImage: require("../../../assets/images/Article1.jpg"),
    content: `Free will has been one of the most enduring debates in philosophy...`,
  },
  {
    id: 2,
    category: "Science",
    title: "Can Science Explain Consciousness?",
    summary:
      "Despite advances in neuroscience, consciousness remains one of the most enigmatic phenomena.",
    readTime: "10 min read",
    author: "Anil Seth",
    coverImage: require("../../../assets/images/article2.jpg"),
    content: `Consciousness refers to the subjective experience of being aware...`,
  },
  {
    id: 3,
    category: "Society",
    title: "Why Inequality Persists in Modern Economies",
    summary:
      "Economic growth has not eliminated inequality; in some cases, it has intensified it.",
    readTime: "14 min read",
    author: "Thomas Piketty",
    coverImage: require("../../../assets/images/article3.jpg"),
    content: `Economic inequality has existed throughout history...`,
  },
  {
    id: 4,
    category: "Psychology",
    title: "The Paradox of Choice",
    summary:
      "More options can sometimes lead to anxiety, regret, and decision paralysis.",
    readTime: "9 min read",
    author: "Barry Schwartz",
    coverImage: require("../../../assets/images/article4.jpg"),
    content: `In modern societies, people are often presented with an overwhelming number of choices...`,
  },
];

const ArticleScreen = ({ onBack }) => {
  const [activeCategory, setActiveCategory] = useState("All");

  const filteredArticles =
    activeCategory === "All"
      ? ARTICLES
      : ARTICLES.filter((a) => a.category === activeCategory);

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.stickyHeader}>
        <TouchableOpacity onPress={onBack} style={styles.backBtn}>
          <Image
            source={require("../../../assets/icon/backbutton.png")}
            style={styles.backIcon}
          />
        </TouchableOpacity>

        <View style={{ flex: 1, alignItems: "center" }}>
          <Text style={styles.headerTitle}>Daily Articles</Text>
          <Text style={styles.headerSub}>Curated reading for CAT VARC</Text>
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingTop: verticalScale(90),
          paddingBottom: verticalScale(20),
        }}
      >
        {/* Categories */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {CATEGORIES.map((cat) => {
            const isActive = activeCategory === cat;
            return (
              <TouchableOpacity
                key={cat}
                style={[styles.tab, isActive && styles.activeTab]}
                onPress={() => setActiveCategory(cat)}
              >
                <Text
                  style={[styles.tabText, isActive && styles.activeTabText]}
                >
                  {cat}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* Articles */}
        {filteredArticles.map((item) => (
          <TouchableOpacity key={item.id} style={styles.card}>
            <Text style={styles.cardTitle}>{item.title}</Text>
            <Text style={styles.cardSummary} numberOfLines={3}>
              {item.summary}
            </Text>
            <View style={styles.cardFooter}>
              <Text style={styles.readTime}>{item.readTime}</Text>
              <Text style={styles.openIcon}>Read →</Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};
export default ArticleScreen

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#F9FAF6" },

  stickyHeader: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: "#F9FAF6",
    paddingHorizontal: scale(10),
    paddingVertical: verticalScale(10),
    flexDirection: "row",
    alignItems: "center",
    zIndex: 10,
  },

  backBtn: { marginRight: scale(8) },
  backIcon: { width: scale(22), height: scale(22), tintColor: "#1F3B1F" },

  headerTitle: {
    fontSize: scale(22),
    fontWeight: "800",
    color: "#1F3B1F",
    marginBottom: verticalScale(2),
  },
  headerSub: { fontSize: scale(12), color: "#6B7280" },

  tab: {
    paddingVertical: verticalScale(8),
    paddingHorizontal: scale(16),
    borderRadius: scale(22),
    backgroundColor: "#ECFDF5",
    marginRight: scale(10),
  },
  activeTab: { backgroundColor: "#1F3B1F" },
  tabText: { fontSize: scale(13), fontWeight: "600", color: "#1F3B1F" },
  activeTabText: { color: "#FFFFFF" },

  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: scale(18),
    padding: scale(16),
    marginBottom: verticalScale(16),
    elevation: 2,
  },

  cardTitle: {
    fontSize: scale(16),
    fontWeight: "700",
    color: "#0F172A",
    marginBottom: verticalScale(6),
  },
  cardSummary: {
    fontSize: scale(14),
    color: "#4B5563",
    lineHeight: verticalScale(20),
    marginBottom: verticalScale(12),
  },
  cardFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  readTime: { fontSize: scale(12), color: "#6B7280" },
  openIcon: { fontSize: scale(13), fontWeight: "700", color: "#1F3B1F" },
});
