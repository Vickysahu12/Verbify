import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { useRoute, useNavigation } from "@react-navigation/native";
import { articles } from "../../practiceArea/Article/data/Article"

const { width } = Dimensions.get("window");

const ArticleReadScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();

  const { articleId } = route.params || {}; // safe destructuring

  // Find article by id
  const article = articles.find(a => a.id === articleId);

  const [scrollProgress, setScrollProgress] = useState(0);

  // Prevent crash if article not found
  if (!article) {
    return (
      <View style={styles.container}>
        <Text style={{ padding: 20 }}>Article not found.</Text>
      </View>
    );
  }

  const handleScroll = (event) => {
    const { layoutMeasurement, contentOffset, contentSize } =
      event.nativeEvent;

    const progress =
      contentOffset.y /
      (contentSize.height - layoutMeasurement.height);

    setScrollProgress(progress > 1 ? 1 : progress);
  };

  return (
    <View style={styles.container}>
      {/* PROGRESS BAR */}
      <View style={styles.progressBarBackground}>
        <View
          style={[
            styles.progressBarFill,
            { width: `${scrollProgress * 100}%` },
          ]}
        />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        contentContainerStyle={{ paddingBottom: 120 }}
      >
        <Image source={article.image} style={styles.image} />

        <View style={styles.content}>
          <Text style={styles.tag}>{article.tag}</Text>

          <Text style={styles.title}>{article.title}</Text>

          <View style={styles.metaRow}>
            <Text style={styles.meta}>{article.meta}</Text>

            <View
              style={[
                styles.levelBadge,
                { backgroundColor: article.levelColor },
              ]}
            >
              <Text
                style={[
                  styles.levelText,
                  { color: article.levelText },
                ]}
              >
                {article.level}
              </Text>
            </View>
          </View>

          {/* ✅ DYNAMIC CONTENT */}
          {article.content?.map((para, index) => (
            <Text key={index} style={styles.paragraph}>
              {para}
            </Text>
          ))}
        </View>
      </ScrollView>

      {/* ANALYZE BUTTON */}
      <TouchableOpacity
        style={styles.button}
        onPress={() =>
          navigation.navigate("ArticleAnalyze", {
            articleId: article.id, // pass only id
          })
        }
      >
        <Text style={styles.buttonText}>
          Analyze This Passage →
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default ArticleReadScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9FAF6",
  },

  progressBarBackground: {
    height: 4,
    backgroundColor: "#E5E7EB",
  },

  progressBarFill: {
    height: "100%",
    backgroundColor: "#1F3B1F",
  },

  image: {
    width: "100%",
    height: 240,
  },

  content: {
    padding: 20,
  },

  tag: {
    fontSize: 12,
    fontWeight: "600",
    color: "#1F3B1F",
    letterSpacing: 1,
  },

  title: {
    fontSize: 24,
    fontWeight: "700",
    color: "#111827",
    marginTop: 6,
  },

  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
    marginBottom: 12,
  },

  meta: {
    fontSize: 13,
    color: "#6B7280",
    marginRight: 10,
  },

  paragraph: {
    fontSize: 16,
    lineHeight: 26,
    color: "#374151",
    marginTop: 16,
  },

  levelBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
  },

  levelText: {
    fontSize: 11,
    fontWeight: "600",
  },

  button: {
    position: "absolute",
    bottom: 16,
    left: 16,
    right: 16,
    backgroundColor: "#1F3B1F",
    padding: 18,
    borderRadius: 16,
    alignItems: "center",
  },

  buttonText: {
    color: "#FFF",
    fontWeight: "700",
    fontSize: 15,
  },
});
