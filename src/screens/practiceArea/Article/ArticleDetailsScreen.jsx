import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRoute } from "@react-navigation/native";
import { articles } from "../../practiceArea/Article/data/Article";

const ArticleAnalyzeScreen = () => {
  const route = useRoute();
  const { articleId } = route.params || {};

  const article = articles.find(a => a.id === articleId);

if (!article) {
  return (
    <SafeAreaView style={styles.center}>
      <Text style={styles.Textt}>
        Read An Article Before Analysis
      </Text>
    </SafeAreaView>
  );
}

const analysis = article?.analysis;

if (!analysis) {
  return (
    <SafeAreaView style={styles.center}>
      <Text style={styles.Textt}>
        Analysis missing
      </Text>
    </SafeAreaView>
  );
}



  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <StatusBar barStyle="dark-content" />

      <View style={{ flex: 1 }}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          stickyHeaderIndices={[0]}
          contentContainerStyle={styles.scrollContainer}
        >
          {/* ===== STICKY HEADER ===== */}
          <View style={styles.stickyTop}>
            <Text style={styles.varc}>VARC ANALYSIS</Text>

            <Text style={styles.title} numberOfLines={2}>
              {article.title}
            </Text>

            <View style={styles.scoreRow}>
              <Text style={styles.reading}>Reading Complete ✓</Text>
              <Text style={styles.score}>{analysis.score}%</Text>
            </View>

            <View style={styles.progressBg}>
              <View
                style={[
                  styles.progressFill,
                  { width: `${analysis.score}%` },
                ]}
              />
            </View>

            <Text style={styles.scoreLabel}>
              COMPREHENSION SCORE
            </Text>
          </View>

          {/* ===== CENTRAL IDEA ===== */}
          <View style={styles.card}>
            <Text style={styles.cardTitle}>The Central Idea</Text>
            <Text style={styles.quote}>
              “{analysis.centralIdea}”
            </Text>
          </View>

          {/* ===== TONE ===== */}
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Author’s Tone</Text>

            <View style={styles.toneRow}>
              <View style={styles.activePill}>
                <Text style={styles.activePillText}>
                  {analysis.tone.main}
                </Text>
              </View>

              {analysis.tone.options.map((item, i) => (
                <View key={i} style={styles.inactivePill}>
                  <Text style={styles.inactiveText}>
                    {item}
                  </Text>
                </View>
              ))}
            </View>

            <View style={styles.blueBox}>
              <Text style={styles.blueTitle}>
                Why {analysis.tone.main}?
              </Text>
              <Text style={styles.blueText}>
                {analysis.tone.explanation}
              </Text>
            </View>
          </View>

          {/* ===== STRUCTURE ===== */}
          <View style={styles.card}>
            <View style={styles.structureHeader}>
              <Text style={styles.cardTitle}>
                Logical Structure
              </Text>
              <View style={styles.levelBadge}>
                <Text style={styles.levelText}>
                  LEVEL: {analysis.difficulty}
                </Text>
              </View>
            </View>

            {analysis.structure.map((item, i) => (
              <View key={i} style={styles.structureItem}>
                <View style={styles.dot} />
                <View style={{ flex: 1 }}>
                  <Text style={styles.structureHeading}>
                    {item.heading}
                  </Text>
                  <Text style={styles.structureText}>
                    {item.text}
                  </Text>
                </View>
              </View>
            ))}
          </View>

          {/* ===== ARGUMENTS ===== */}
          <View style={styles.card}>
            <Text style={styles.cardTitle}>
              Arguments & Evidence
            </Text>

            {analysis.arguments.map((arg, i) => (
              <View key={i} style={styles.argumentBlock}>
                <Text style={styles.claim}>
                  Claim: {arg.claim}
                </Text>

                {arg.evidence && (
                  <View style={styles.evidenceBox}>
                    <Text style={styles.evidenceText}>
                      “{arg.evidence}”
                    </Text>
                  </View>
                )}
              </View>
            ))}
          </View>

          {/* ===== CAT TIP ===== */}
          <View style={styles.tipBox}>
            <Text style={styles.tipTitle}>CAT TIP</Text>
            <Text style={styles.tipText}>
              {analysis.catTip}
            </Text>
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

export default ArticleAnalyzeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F2F5F9",
  },

  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    color:"#000"
  },
  Textt:{
    color:"#000"
  },

  scrollContainer: {
    paddingBottom: 20,
  },

  /* ===== HEADER ===== */
  stickyTop: {
    paddingTop: 10,
    paddingHorizontal: 20,
    paddingBottom: 16,
    backgroundColor: "#F2F5F9",
  },

  varc: {
    fontSize: 12,
    letterSpacing: 1.5,
    color: "#1F3B1F",
    fontWeight: "600",
  },

  title: {
    fontSize: 20,
    fontWeight: "700",
    marginTop: 6,
    color: "#111827",
  },

  scoreRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
    alignItems: "center",
  },

  reading: {
    color: "#1F3B1F",
    fontWeight: "600",
  },

  score: {
    fontSize: 26,
    fontWeight: "800",
    color: "#1F3B1F",
  },

  progressBg: {
    height: 6,
    backgroundColor: "#E5E7EB",
    borderRadius: 10,
    marginTop: 5
  },

  progressFill: {
    height: "100%",
    backgroundColor: "#1F3B1F",
    borderRadius: 10,
  },

  scoreLabel: {
    fontSize: 11,
    color: "#6B7280",
    marginTop: 6,
    letterSpacing: 1,
  },

  /* ===== CARD ===== */
  card: {
    backgroundColor: "#FFFFFF",
    marginHorizontal: 16,
    marginTop: 20,
    paddingVertical: 20,
    paddingHorizontal: 18,
    borderRadius: 20,
    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
  },

  cardTitle: {
    fontSize: 17,
    fontWeight: "700",
    marginBottom: 14,
    letterSpacing: 0.3,
    color:"#000"
  },

  quote: {
    fontSize: 15,
    lineHeight: 26,
    fontStyle: "italic",
    color: "#374151",
  },

  toneRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 14,
  },

  activePill: {
    backgroundColor: "#1F3B1F",
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
    marginRight: 8,
    marginBottom: 8,
  },

  activePillText: {
    color: "#FFF",
    fontWeight: "600",
  },

  inactivePill: {
    backgroundColor: "#E5E7EB",
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
    marginRight: 8,
    marginBottom: 8,
  },

  inactiveText: {
    color: "#374151",
  },

  blueBox: {
    backgroundColor: "#EFF6FF",
    padding: 14,
    borderRadius: 12,
  },

  blueTitle: {
    fontWeight: "700",
    color: "#1F3B1F",
  },

  blueText: {
    marginTop: 6,
    color: "#374151",
    lineHeight: 22,
  },

  structureHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },

  levelBadge: {
    backgroundColor: "#DBEAFE",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },

  levelText: {
    fontSize: 11,
    fontWeight: "700",
    color: "#1F3B1F",
  },

  structureItem: {
    flexDirection: "row",
    marginTop: 12,
  },

  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#1F3B1F",
    marginTop: 6,
    marginRight: 10,
  },

  structureHeading: {
    fontWeight: "700",
    color: "#1F3B1F",
  },

  structureText: {
    marginTop: 6,
    color: "#374151",
    lineHeight: 22,
  },

  argumentBlock: {
    marginTop: 16,
  },

  claim: {
    fontWeight: "600",
    color: "#111827",
  },

  evidenceBox: {
    backgroundColor: "#F3F4F6",
    padding: 12,
    borderRadius: 10,
    marginTop: 8,
  },

  evidenceText: {
    fontStyle: "italic",
    color: "#374151",
  },

  tipBox: {
    backgroundColor: "#FEF3C7",
    margin: 16,
    padding: 18,
    borderRadius: 16,
  },

  tipTitle: {
    fontWeight: "700",
    color: "#B45309",
    marginBottom: 8,
  },

  tipText: {
    color: "#92400E",
    lineHeight: 22,
  },

  cta: {
    backgroundColor: "#1F3B1F",
    padding: 18,
    borderRadius: 18,
    alignItems: "center",
    margin: 16,
  },

  ctaText: {
    color: "#FFF",
    fontWeight: "700",
    fontSize: 16,
  },

  ctaSub: {
    marginTop: 6,
    color: "#DBEAFE",
    fontSize: 12,
  },
});
