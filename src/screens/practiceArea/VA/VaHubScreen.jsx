import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";

const VAHubScreen = () => {
  const navigation = useNavigation();
  const [openIndex, setOpenIndex] = useState(null);

  const toggle = (i) => {
    setOpenIndex(openIndex === i ? null : i);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />

      <ScrollView
        showsVerticalScrollIndicator={false}
        stickyHeaderIndices={[0]}
      >
        {/* ================= HEADER ================= */}

        <View style={styles.header}>
          <View style={styles.profileRow}>
            <View style={styles.avatar} />
            <View>
              <Text style={styles.brand}>VA Concept Hub</Text>
              <Text style={styles.subtitle}>PREMIUM CAT ACCESS</Text>
            </View>
          </View>
        </View>

        {/* ================= TODAY CARD ================= */}

        <View style={styles.challengeCard}>
          <Text style={styles.taskLabel}>⚡ TODAY'S TASK</Text>

          <Text style={styles.challengeTitle}>
            Daily VA Challenge
          </Text>

          <Text style={styles.challengeDesc}>
            Solve today's Parajumble to maintain your 5-day streak!
          </Text>

          <TouchableOpacity
            style={styles.startButton}
            onPress={() => navigation.navigate("Parajumble")}
          >
            <Text style={styles.startButtonText}>
              Start Challenge
            </Text>
          </TouchableOpacity>
        </View>

        {/* ================= MASTERY MODULES ================= */}

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Mastery Modules</Text>
          <Text style={styles.progressLink}>View Progress</Text>
        </View>

        {renderModule(
          "Parajumbles",
          "Mastering chronological flow",
          82,
          () => navigation.navigate("Parajumble")
        )}

        {renderModule(
          "Odd One Out",
          "Identifying the outlier theme",
          45,
          () => {navigation.navigate("OddOne")}
        )}

        {renderModule(
          "Para-Summary",
          "Extracting the core essence",
          12,
          () => {}
        )}

        {/* ================= CORE STRATEGIES ================= */}

        <View style={[styles.sectionHeader, { marginTop: 20 }]}>
          <Text style={styles.sectionTitle}>Core Strategies</Text>
        </View>

        {renderAccordion(
          0,
          "Identifying Opening Sentences",
          "Look for broad contextual statements. Avoid sentences starting with pronouns."
        )}

        {renderAccordion(
          1,
          "Connecting Transition Words",
          "Track words like However, Therefore, Moreover."
        )}

        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );

  function renderAccordion(index, title, content) {
    const isOpen = openIndex === index;

    return (
      <TouchableOpacity
        activeOpacity={0.9}
        style={styles.accordionCard}
        onPress={() => toggle(index)}
      >
        <View style={styles.accordionHeader}>
          <Text style={styles.accordionTitle}>{title}</Text>
          <Text style={styles.arrow}>{isOpen ? "⌃" : "⌄"}</Text>
        </View>

        {isOpen && (
          <View style={styles.accordionBody}>
            <Text style={styles.accordionText}>{content}</Text>
          </View>
        )}
      </TouchableOpacity>
    );
  }
};

export default VAHubScreen;

/* ================= COMPONENT HELPERS ================= */
const renderModule = (title, subtitle, progress, onPress) => {
  return (
    <TouchableOpacity
      activeOpacity={0.9}
      style={styles.moduleCard}
      onPress={onPress}
    >
      <View style={styles.moduleTop}>
        <View>
          <Text style={styles.moduleTitle}>{title}</Text>
          <Text style={styles.moduleSubtitle}>{subtitle}</Text>
        </View>

        <Text style={styles.percent}>{progress}%</Text>
      </View>

      <View style={styles.progressBar}>
        <View
          style={[
            styles.progressFill,
            { width: `${progress}%` },
          ]}
        />
      </View>

      <View style={styles.learnButton}>
        <Text style={styles.learnButtonText}>
          Learn the Strategy
        </Text>
      </View>
    </TouchableOpacity>
  );
};

/* ================= STYLES ================= */

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9FAF6",
  },

  header: {
    backgroundColor: "#F9FAF6",
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 20,
    flexDirection: "row",
    alignItems: "center",
  },

  profileRow: {
    flexDirection: "row",
    alignItems: "center",
  },

  avatar: {
    width: 45,
    height: 45,
    borderRadius: 22,
    backgroundColor: "#D1D5DB",
    marginRight: 12,
  },

  brand: {
    fontSize: 18,
    fontWeight: "800",
    color: "#1F3B1F",
  },

  subtitle: {
    fontSize: 11,
    letterSpacing: 1,
    color: "#B58900",
    marginTop: 2,
  },

  challengeCard: {
    backgroundColor: "#1F3B1F",
    marginHorizontal: 20,
    borderRadius: 20,
    padding: 24,
    marginBottom: 25,
  },

  taskLabel: {
    fontSize: 12,
    color: "#A7F3D0",
    fontWeight: "700",
    letterSpacing: 1,
  },

  challengeTitle: {
    fontSize: 22,
    fontWeight: "800",
    color: "#FFF",
    marginTop: 8,
  },

  challengeDesc: {
    fontSize: 15,
    color: "#E5E7EB",
    marginTop: 8,
    lineHeight: 22,
  },

  startButton: {
    marginTop: 18,
    backgroundColor: "#FFF",
    paddingVertical: 12,
    borderRadius: 14,
    alignItems: "center",
  },

  startButtonText: {
    color: "#1F3B1F",
    fontWeight: "700",
  },
sectionHeader: {
  flexDirection: "row",
  justifyContent: "space-between",
  alignItems: "center",
  marginHorizontal: 20,
  marginBottom: 10,
},

sectionTitle: {
  fontSize: 18,
  fontWeight: "800",
  color: "#1F3B1F",
},


  progressLink: {
    fontSize: 13,
    color: "#1F3B1F",
    fontWeight: "600",
  },

  moduleCard: {
    backgroundColor: "#FFFFFF",
    marginHorizontal: 20,
    borderRadius: 18,
    padding: 20,
    marginTop: 10,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 4,
  },

  moduleTop: {
    flexDirection: "row",
    justifyContent: "space-between",
  },

  moduleTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#111827",
  },

  moduleSubtitle: {
    fontSize: 13,
    color: "#6B7280",
    marginTop: 3,
  },

  percent: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1F3B1F",
  },

  progressBar: {
    height: 6,
    backgroundColor: "#E5E7EB",
    borderRadius: 6,
    marginTop: 14,
    overflow: "hidden",
  },

  progressFill: {
    height: "100%",
    backgroundColor: "#1F3B1F",
  },

  learnButton: {
    marginTop: 15,
    borderWidth: 1,
    borderColor: "#1F3B11",
    paddingVertical: 10,
    borderRadius: 12,
    alignItems: "center",
  },

  learnButtonText: {
    color: "#1F3B1F",
    fontWeight: "600",
  },

  accordionCard: {
    backgroundColor: "#FFFFFF",
    marginHorizontal: 20,
    borderRadius: 18,
    padding: 18,
    marginTop: 15,
  },

  accordionHeader: {
    flexDirection: "row",
    alignItems: "center",
  },

  accordionTitle: {
    flex: 1,
    fontSize: 15,
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

  accordionText: {
    fontSize: 13,
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
  
});
