import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Platform,
} from "react-native";

const { width } = Dimensions.get("window");
const scale = (s) => (width / 375) * s;

const RCLearningScreen = () => {
  const [openIndex, setOpenIndex] = useState(0);

  const toggle = (i) => {
    setOpenIndex(openIndex === i ? null : i);
  };

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: scale(140) }}
      >
        {/* ================= HEADER ================= */}
        <View style={styles.header}>
          <Text style={styles.back}>←</Text>
          <Text style={styles.headerTitle}>RC Mastery Guide</Text>
          <Text style={styles.bookmark}>🔖</Text>
        </View>

        {/* ================= PROGRESS ================= */}
        <View style={styles.progressWrap}>
          <Text style={styles.progressLabel}>COURSE PROGRESS</Text>
          <Text style={styles.progressPercent}>45% Complete</Text>
        </View>

        <View style={styles.progressBar}>
          <View style={styles.progressFill} />
        </View>

        {/* ================= VIDEO CARD ================= */}
        <View style={styles.videoCard}>
          <View style={styles.playBtn}>
            <Text style={styles.playIcon}>▶</Text>
          </View>

          <View style={styles.videoBottom}>
            <Text style={styles.videoTitle}>
              RC Strategy: The Skimming & Scanning Method
            </Text>
            <Text style={styles.videoTime}>04:12 / 12:45</Text>
          </View>
        </View>

        {/* ================= FRAMEWORK ================= */}
        <Text style={styles.sectionTitle}>📘 Strategic Framework</Text>

        {/* STEP 1 */}
        <TouchableOpacity
          activeOpacity={0.85}
          style={styles.accordion}
          onPress={() => toggle(0)}
        >
          <View style={styles.accordionHeader}>
            <Text style={styles.step}>1</Text>
            <Text style={styles.accordionTitle}>Understanding Tone</Text>
            <Text style={styles.arrow}>{openIndex === 0 ? "⌃" : "⌄"}</Text>
          </View>

          {openIndex === 0 && (
            <View style={styles.accordionBody}>
              <Text style={styles.bullet}>
                • Identify adjectives & adverbs revealing author sentiment.
              </Text>
              <Text style={styles.bullet}>
                • Look for structural pivots like “However”, “Yet”.
              </Text>

              <View style={styles.tipBox}>
                <Text style={styles.tipTitle}>💡 PRO TIP</Text>
                <Text style={styles.tipText}>
                  Frequent rhetorical questions often indicate a skeptical
                  or inquisitive tone.
                </Text>
              </View>
            </View>
          )}
        </TouchableOpacity>

        {/* STEP 2 */}
        <TouchableOpacity
          activeOpacity={0.85}
          style={styles.accordion}
          onPress={() => toggle(1)}
        >
          <View style={styles.accordionHeader}>
            <Text style={styles.step}>2</Text>
            <Text style={styles.accordionTitle}>Identifying Main Idea</Text>
            <Text style={styles.arrow}>{openIndex === 1 ? "⌃" : "⌄"}</Text>
          </View>
        </TouchableOpacity>

        {/* STEP 3 */}
        <TouchableOpacity
          activeOpacity={0.85}
          style={styles.accordion}
          onPress={() => toggle(2)}
        >
          <View style={styles.accordionHeader}>
            <Text style={styles.step}>3</Text>
            <Text style={styles.accordionTitle}>Inference Questions</Text>
            <Text style={styles.arrow}>{openIndex === 2 ? "⌃" : "⌄"}</Text>
          </View>
        </TouchableOpacity>

        {/* ================= INTERACTIVE EXAMPLE ================= */}
        <Text style={styles.sectionTitle}>🧠 Interactive Example</Text>

        <View style={styles.passageCard}>
          <Text style={styles.passage}>
            The digitalization of education has promised democratized access
            for all.{" "}
            <Text style={styles.highlightBlue}>However</Text>, the reality
            reflects a stark digital divide.{" "}
            <Text style={styles.highlightYellow}>This suggests</Text> that
            technology alone is not a panacea.
          </Text>
        </View>

        <View style={styles.infoBlue}>
          <Text style={styles.infoTitle}>
            Structural Pivot: “However”
          </Text>
          <Text style={styles.infoText}>
            Indicates a shift from a positive belief to critical evaluation.
          </Text>
        </View>

        <View style={styles.infoYellow}>
          <Text style={styles.infoTitle}>
            Inference Marker: “This suggests”
          </Text>
          <Text style={styles.infoText}>
            Signals the author’s central argument or conclusion.
          </Text>
        </View>
      </ScrollView>

      {/* ================= CTA ================= */}
      <View style={styles.bottomBar}>
        <TouchableOpacity activeOpacity={0.9} style={styles.cta}>
          <Text style={styles.ctaText}>Start Practice Quiz →</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default RCLearningScreen;

/* ================= STYLES ================= */

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: "#F9FAF6",
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: scale(16),
    alignItems: "center",
    marginTop: 25,
  },

  back: { fontSize: 18 },
  bookmark: { fontSize: 18 },

  headerTitle: {
    fontSize: scale(16),
    fontWeight: "800",
    color: "#1F3B1F",
  },

  progressWrap: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: scale(16),
    marginTop: 4,
  },

  progressLabel: {
    fontSize: scale(11),
    fontWeight: "700",
    color: "#1F3B1F",
  },

  progressPercent: {
    fontSize: scale(11),
    fontWeight: "600",
    color: "#1F3B1F",
  },

  progressBar: {
    height: 6,
    backgroundColor: "#DDE8E1",
    marginHorizontal: scale(16),
    borderRadius: 6,
    marginTop: 6,
  },

  progressFill: {
    width: "45%",
    height: "100%",
    backgroundColor: "#1F3B1F",
    borderRadius: 6,
  },

  videoCard: {
    height: 200,
    backgroundColor: "#0F1A13",
    borderRadius: 20,
    margin: scale(16),
    justifyContent: "center",
    alignItems: "center",
  },

  playBtn: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "#1F3B1F",
    justifyContent: "center",
    alignItems: "center",
  },

  playIcon: {
    color: "#F9FAF6",
    fontSize: 22,
    marginLeft: 2,
  },

  videoBottom: {
    position: "absolute",
    bottom: 14,
    left: 14,
    right: 14,
  },

  videoTitle: {
    color: "#F9FAF6",
    fontSize: 14,
    fontWeight: "700",
  },

  videoTime: {
    color: "#D1D5DB",
    fontSize: 11,
    marginTop: 4,
  },

  sectionTitle: {
    fontSize: scale(16),
    fontWeight: "800",
    marginHorizontal: scale(16),
    marginTop: scale(26),
    color: "#1F3B1F",
  },

  accordion: {
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    marginHorizontal: scale(16),
    marginTop: 12,
    padding: 16,
  },

  accordionHeader: {
    flexDirection: "row",
    alignItems: "center",
  },

  step: {
    backgroundColor: "#E9F2EC",
    width: 26,
    height: 26,
    borderRadius: 13,
    textAlign: "center",
    textAlignVertical: "center",
    fontWeight: "700",
    color: "#1F3B1F",
  },

  accordionTitle: {
    flex: 1,
    marginLeft: 10,
    fontWeight: "700",
    color: "#1F3B1F",
  },

  arrow: {
    fontSize: 14,
    color: "#1F3B1F",
  },

  accordionBody: {
    marginTop: 12,
  },

  bullet: {
    fontSize: 13,
    marginBottom: 6,
    lineHeight: 20,
    color: "#374151",
  },

  tipBox: {
    backgroundColor: "#E9F2EC",
    padding: 12,
    borderRadius: 12,
    marginTop: 10,
  },

  tipTitle: {
    fontWeight: "700",
    fontSize: 12,
    color: "#1F3B1F",
  },

  tipText: {
    fontSize: 12,
    marginTop: 4,
    lineHeight: 18,
    color: "#374151",
  },

  passageCard: {
    backgroundColor: "#FFFFFF",
    margin: scale(16),
    padding: 16,
    borderRadius: 18,
  },

  passage: {
    fontSize: 14,
    lineHeight: 22,
    color: "#111827",
  },

  highlightBlue: {
    backgroundColor: "#DDE8E1",
    fontWeight: "700",
    color: "#1F3B1F",
  },

  highlightYellow: {
    backgroundColor: "#F3EED9",
    fontWeight: "700",
    color: "#1F3B1F",
  },

  infoBlue: {
    backgroundColor: "#E9F2EC",
    marginHorizontal: scale(16),
    padding: 14,
    borderRadius: 14,
    marginBottom: 10,
  },

  infoYellow: {
    backgroundColor: "#F6F3E6",
    marginHorizontal: scale(16),
    padding: 14,
    borderRadius: 14,
  },

  infoTitle: {
    fontWeight: "700",
    fontSize: 13,
    color: "#1F3B1F",
  },

  infoText: {
    fontSize: 12,
    marginTop: 4,
    lineHeight: 18,
    color: "#374151",
  },

  bottomBar: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
    backgroundColor: "#F9FAF6",
  },

  cta: {
    backgroundColor: "#1F3B1F",
    paddingVertical: 16,
    borderRadius: 18,
    alignItems: "center",
  },

  ctaText: {
    color: "#F9FAF6",
    fontSize: 15,
    fontWeight: "800",
  },
  

  
});
