import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  StatusBar,
  Image,
} from "react-native";
import { useRoute, useNavigation } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import { articles } from "../../practiceArea/Article/data/Article";
import Backbutton from "../../../assets/icon/backbutton.png";

const { width } = Dimensions.get("window");

const ArticleReadScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { articleId } = route.params || {};

  const article = articles.find((a) => a.id === articleId);

  const [scrollProgress, setScrollProgress] = useState(0);
  const [showButton, setShowButton] = useState(false);

  if (!article) {
    return (
      <SafeAreaView style={styles.center}>
        <Text>Article not found.</Text>
      </SafeAreaView>
    );
  }

  const handleScroll = (event) => {
    const { layoutMeasurement, contentOffset, contentSize } =
      event.nativeEvent;

    const progress =
      contentOffset.y /
      (contentSize.height - layoutMeasurement.height);

    const finalProgress = progress > 1 ? 1 : progress;

    setScrollProgress(finalProgress);

    // Show button only when near end (95%)
    if (finalProgress >= 0.5) {
      setShowButton(true);
    } else {
      setShowButton(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />

      {/* 🔹 Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
          activeOpacity={0.7}
        >
          <Image
            source={Backbutton}
            style={styles.backIcon}
            resizeMode="contain"
          />
        </TouchableOpacity>

        <View style={styles.headerCenter}>
          <Text style={styles.headerTop}>Article Reading</Text>
          <Text style={styles.headerBottom}>CAT Prep Series</Text>
        </View>

        <View style={{ width: 40 }} />
      </View>

      {/* 🔹 Progress Bar */}
      <View style={styles.progressBackground}>
        <View
          style={[
            styles.progressFill,
            { width: `${scrollProgress * 100}%` },
          ]}
        />
      </View>

      {/* 🔹 Content */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        contentContainerStyle={styles.scrollContent}
      >
        <Text style={styles.tag}>{article.tag}</Text>

        <Text style={styles.title}>{article.title}</Text>

        <Text style={styles.author}>{article.meta}</Text>

        {article.content?.map((para, index) => (
          <Text key={index} style={styles.paragraph}>
            {para}
          </Text>
        ))}

        {/* ✅ Button only when article ends */}
        {showButton && (
          <TouchableOpacity
            style={styles.simpleButton}
            onPress={() =>
              navigation.navigate("ArticleDetail", {
                articleId: article.id,
              })
            }
          >
            <Text style={styles.simpleButtonText}>
              Analyze This Passage →
            </Text>
          </TouchableOpacity>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default ArticleReadScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9FAF6",
  },

  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  /* HEADER */

  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: "#F9FAF6",
  },

  backButton: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },

  backIcon: {
    width: 22,
    height: 22,
  },

  headerCenter: {
    alignItems: "center",
  },

  headerTop: {
    fontSize: 11,
    letterSpacing: 1,
    fontWeight: "700",
    color: "#1F3B1F",
  },

  headerBottom: {
    fontSize: 12,
    color: "#6B7280",
  },

  /* PROGRESS BAR */

  progressBackground: {
    height: 3,
    backgroundColor: "#E5E7EB",
  },

  progressFill: {
    height: "100%",
    backgroundColor: "#1F3B1F",
  },

  /* CONTENT */

  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 40,
  },

  tag: {
    fontSize: 12,
    fontWeight: "700",
    color: "#1F3B1F",
    letterSpacing: 1,
    marginBottom: 8,
  },

  title: {
    fontSize: width < 380 ? 24 : 28,
    fontWeight: "800",
    color: "#111827",
    lineHeight: 34,
    marginBottom: 12,
  },

  author: {
    fontSize: 14,
    color: "#6B7280",
    marginBottom: 20,
  },

  paragraph: {
    fontSize: 17,
    lineHeight: 28,
    color: "#374151",
    marginBottom: 18,
    letterSpacing: 0.3,
  },

  /* SIMPLE END BUTTON */

  simpleButton: {
    marginTop: 30,
    marginBottom: 40,
    backgroundColor: "#1F3B1F",
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
  },

  simpleButtonText: {
    color: "#FFF",
    fontSize: 15,
    fontWeight: "600",
  },
});
