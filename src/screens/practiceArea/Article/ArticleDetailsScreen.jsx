import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Switch,
} from "react-native";

const { width } = Dimensions.get("window");
const scale = (s) => (width / 375) * s;

const ArticleAnalyzeScreen = () => {
  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      
      {/* HEADER */}
      <View style={styles.header}>
        <Text style={styles.sectionLabel}>ARTICLE ANALYSIS</Text>
        <Text style={styles.title}>The Silken Road: Geopolitics</Text>
      </View>

      {/* PROGRESS */}
      <View style={styles.progressWrapper}>
        <View style={styles.progressHeader}>
          <Text style={styles.readingComplete}>Reading Complete ✓</Text>
          <Text style={styles.score}>85%</Text>
        </View>
        <View style={styles.progressBarBg}>
          <View style={styles.progressBarFill} />
        </View>
        <Text style={styles.scoreLabel}>COMPREHENSION SCORE</Text>
      </View>

      {/* CENTRAL IDEA */}
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Text style={styles.cardTitle}>The Central Idea</Text>
          <View style={styles.expertBadge}>
            <Text style={styles.expertText}>EXPERT</Text>
          </View>
        </View>
        <Text style={styles.quote}>
          "The author argues that the revival of ancient trade routes is not
          merely a nostalgic economic endeavor but a strategic geopolitical
          realignment aimed at shifting the global power center toward Eurasia."
        </Text>
      </View>

      {/* AUTHOR TONE */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Author’s Tone</Text>

        <View style={styles.toneRow}>
          <View style={styles.activeTone}>
            <Text style={styles.activeToneText}>Analytical</Text>
          </View>
          <View style={styles.tonePill}>
            <Text style={styles.toneText}>Objective</Text>
          </View>
          <View style={styles.tonePill}>
            <Text style={styles.toneText}>Speculative</Text>
          </View>
        </View>

        <View style={styles.highlightBox}>
          <Text style={styles.highlightTitle}>Why Analytical?</Text>
          <Text style={styles.highlightText}>
            The author utilizes historical data and contemporary policy
            analysis to dissect complex interactions rather than relying on
            emotional appeal.
          </Text>
        </View>
      </View>

      {/* LOGICAL STRUCTURE */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Logical Structure</Text>

        <View style={styles.structureItem}>
          <Text style={styles.structureHeading}>INTRODUCTION</Text>
          <Text style={styles.structureText}>
            Establishes the historical context of the Silk Road.
          </Text>
        </View>

        <View style={styles.structureItem}>
          <Text style={styles.structureHeading}>COUNTER-ARGUMENT</Text>
          <Text style={styles.structureText}>
            Addresses critics who claim resource extraction motives.
          </Text>
        </View>

        <View style={styles.structureItem}>
          <Text style={styles.structureHeading}>CONCLUSION</Text>
          <Text style={styles.structureText}>
            Synthesizes geopolitical implications for the 21st century.
          </Text>
        </View>
      </View>

      {/* CTA */}
      <TouchableOpacity style={styles.button}>
        <Text style={styles.buttonText}>Attempt Practice Questions →</Text>
      </TouchableOpacity>

      <View style={{ height: scale(30) }} />
    </ScrollView>
  );
};

export default ArticleAnalyzeScreen;

const COLORS = {
  background: "#F7F8FA",
  card: "#FFFFFF",
  primary: "#1F3B1F",
  primaryLight: "#E8F0FE",
  textDark: "#1C1C1E",
  textLight: "#6B7280",
  border: "#E5E7EB",
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    paddingHorizontal: scale(16),
  },

  header: {
    marginTop: scale(40),
    marginBottom: scale(20),
  },

  sectionLabel: {
    fontSize: scale(12),
    color: COLORS.primary,
    letterSpacing: 1,
    fontWeight: "600",
  },

  title: {
    fontSize: scale(20),
    fontWeight: "700",
    color: COLORS.textDark,
    marginTop: scale(4),
  },

  progressWrapper: {
    marginBottom: scale(20),
  },

  progressHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
  },

  readingComplete: {
    color: COLORS.primary,
    fontWeight: "600",
  },

  score: {
    fontSize: scale(22),
    fontWeight: "700",
    color: COLORS.primary,
  },

  progressBarBg: {
    height: scale(6),
    backgroundColor: COLORS.border,
    borderRadius: 10,
    marginTop: scale(6),
  },

  progressBarFill: {
    width: "85%",
    height: "100%",
    backgroundColor: COLORS.primary,
    borderRadius: 10,
  },

  scoreLabel: {
    fontSize: scale(11),
    color: COLORS.textLight,
    marginTop: scale(6),
  },

  card: {
    backgroundColor: COLORS.card,
    padding: scale(16),
    borderRadius: 14,
    marginBottom: scale(16),
    borderWidth: 1,
    borderColor: COLORS.border,
  },

  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: scale(10),
  },

  cardTitle: {
    fontSize: scale(16),
    fontWeight: "700",
    color: COLORS.textDark,
  },

  expertBadge: {
    backgroundColor: COLORS.primaryLight,
    paddingHorizontal: scale(10),
    paddingVertical: scale(4),
    borderRadius: 20,
  },

  expertText: {
    color: COLORS.primary,
    fontSize: scale(11),
    fontWeight: "600",
  },

  quote: {
    fontSize: scale(14),
    color: COLORS.textLight,
    lineHeight: scale(20),
  },

  toneRow: {
    flexDirection: "row",
    gap: scale(8),
    marginVertical: scale(10),
  },

  activeTone: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: scale(12),
    paddingVertical: scale(6),
    borderRadius: 20,
  },

  activeToneText: {
    color: "#fff",
    fontWeight: "600",
  },

  tonePill: {
    backgroundColor: COLORS.primaryLight,
    paddingHorizontal: scale(12),
    paddingVertical: scale(6),
    borderRadius: 20,
  },

  toneText: {
    color: COLORS.primary,
    fontWeight: "500",
  },

  highlightBox: {
    backgroundColor: COLORS.primaryLight,
    padding: scale(12),
    borderRadius: 12,
    marginTop: scale(10),
  },

  highlightTitle: {
    fontWeight: "700",
    color: COLORS.primary,
    marginBottom: scale(4),
  },

  highlightText: {
    color: COLORS.textDark,
    fontSize: scale(13),
  },

  structureItem: {
    marginTop: scale(10),
  },

  structureHeading: {
    fontSize: scale(12),
    fontWeight: "700",
    color: COLORS.primary,
    letterSpacing: 0.5,
  },

  structureText: {
    fontSize: scale(13),
    color: COLORS.textLight,
    marginTop: scale(4),
  },

  button: {
    backgroundColor: COLORS.primary,
    padding: scale(16),
    borderRadius: 16,
    alignItems: "center",
    marginTop: scale(10),
  },

  buttonText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: scale(15),
  },
});
