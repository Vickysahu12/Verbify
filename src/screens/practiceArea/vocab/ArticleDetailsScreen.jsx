import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  Image,
  Dimensions,
} from "react-native";

const { width, height } = Dimensions.get("window");

// scaling
const scale = (size) => (width / 375) * size;
const verticalScale = (size) => (height / 812) * size;

const ArticleDetailScreen = ({ article, onBack }) => {
  if (!article) return null;

  return (
    <SafeAreaView style={styles.safe}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.backBtn}>
          <Image
            source={require("../../../assets/icon/backbutton.png")}
            style={styles.backIcon}
          />
        </TouchableOpacity>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.container}
      >
        {/* Title */}
        <Text style={styles.title}>{article.title}</Text>
        <Text style={styles.readTime}>{article.readTime}</Text>

        {/* Author */}
        <View style={styles.authorRow}>
          <Text style={styles.authorName}>{article.author}</Text>
        </View>

        {/* Cover Image */}
        <Image source={article.coverImage} style={styles.coverImg} />

        {/* Article Content */}
        <Text style={styles.content}>{article.content}</Text>
      </ScrollView>
    </SafeAreaView>
  );
};

export default ArticleDetailScreen;

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: "#F9FAF6",
  },

  header: {
    paddingHorizontal: scale(12),
    paddingVertical: verticalScale(10),
  },

  backBtn: {
    width: scale(36),
    height: scale(36),
    justifyContent: "center",
  },

  backIcon: {
    width: scale(22),
    height: scale(22),
    tintColor: "#1F3B1F",
  },

  container: {
    paddingHorizontal: scale(16),
    paddingBottom: verticalScale(30),
  },

  title: {
    fontSize: scale(24),
    fontWeight: "800",
    color: "#0F172A",
    marginBottom: verticalScale(6),
  },

  readTime: {
    fontSize: scale(12),
    color: "#6B7280",
    marginBottom: verticalScale(16),
  },

  authorRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: verticalScale(18),
  },

  authorName: {
    fontSize: scale(14),
    fontWeight: "600",
    color: "#1F3B1F",
  },

  coverImg: {
    width: "100%",
    height: verticalScale(200),
    borderRadius: scale(18),
    marginBottom: verticalScale(20),
  },

  content: {
    fontSize: scale(15),
    lineHeight: verticalScale(24),
    color: "#374151",
  },
});
