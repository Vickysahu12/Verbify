import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
} from "react-native";

const HomeScreen = () => {
  return (
    <View style={styles.wrapper}>
      {/* 🔹 STICKY HEADER */}
      <View style={styles.stickyHeader}>
        <View>
          <Text style={styles.greeting}>Good Morning, Vicky</Text>
          <Text style={styles.subGreeting}>
            Day 12 • Building consistency
          </Text>
        </View>

        <TouchableOpacity>
          <Image
            source={require("../assets/icon/notification.png")}
            style={styles.notificationIcon}
          />
        </TouchableOpacity>
      </View>

      {/* 🔹 SCROLLABLE CONTENT */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 120 }}
      >
        {/* Spacer so content doesn't hide behind header */}
        <View style={{ height: 110 }} />

        {/* 🔹 TODAY'S FOCUS */}
        <View style={styles.focusCard}>
          <Text style={styles.focusTitle}>Today's Focus</Text>
          <Text style={styles.focusDesc}>
            VARC Practice • 70 minutes
          </Text>

          {/* Progress bar */}
          <View style={styles.progressBarBg}>
            <View style={styles.progressBarFill} />
          </View>

          <TouchableOpacity style={styles.focusBtn}>
            <Text style={styles.focusBtnText}>Continue</Text>
          </TouchableOpacity>
        </View>

        {/* 🔹 PRACTICE */}
        <Text style={styles.sectionTitle}>Practice</Text>

        <View style={styles.grid}>
          <PracticeCard title="Vocabulary" subtitle="10 / 20 words" />
          <PracticeCard title="Reading" subtitle="12 min article" />
          <PracticeCard title="RC Practice" subtitle="2 passages" />
          <PracticeCard title="VA Practice" subtitle="Para Jumble • OOO" />
        </View>

        {/* 🔹 TESTS */}
        <Text style={styles.sectionTitle}>Tests</Text>

        <View style={styles.testGrid}>
          <TestCard title="RC Test" subtitle="2 passages" />
          <TestCard title="Vocab Test" subtitle="20 questions" />
          <TestCard title="VA Test" subtitle="Para jumble, OOO" />
        </View>

        {/* 🔹 WEEKLY SNAPSHOT */}
        <View style={styles.progressCard}>
          <Text style={styles.progressTitle}>This Week</Text>

          <View style={styles.weekRow}>
            <Text style={styles.weekStat}>⏱ 4h 20m studied</Text>
            <Text style={styles.weekStat}>🔥 3-day streak</Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

export default HomeScreen;

/* 🔹 Cards */
const PracticeCard = ({ title, subtitle }) => (
  <TouchableOpacity style={styles.practiceCard}>
    <Text style={styles.cardTitle}>{title}</Text>
    <Text style={styles.cardSub}>{subtitle}</Text>
  </TouchableOpacity>
);

const TestCard = ({ title, subtitle }) => (
  <TouchableOpacity style={styles.testCard}>
    <Text style={styles.cardTitle}>{title}</Text>
    <Text style={styles.cardSub}>{subtitle}</Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: "#F9FAF6",
  },

  /* 🔹 STICKY HEADER */
  stickyHeader: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
    backgroundColor: "#F9FAF6",
    paddingHorizontal: 20,
    paddingTop: 40,
    paddingBottom: 14,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottomWidth: 0.5,
    borderBottomColor: "#E5E7EB",
  },

  greeting: {
    fontSize: 20,
    fontWeight: "600",
    color: "#111827",
  },

  subGreeting: {
    fontSize: 13,
    color: "#6B7280",
    marginTop: 2,
  },

  notificationIcon: {
    width: 24,
    height: 24,
    tintColor: "#1F3B1F",
  },

  /* Focus */
  focusCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    padding: 20,
    marginHorizontal: 20,
    marginBottom: 28,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },

  focusTitle: {
    fontSize: 14,
    color: "#6B7280",
    marginBottom: 6,
  },

  focusDesc: {
    fontSize: 18,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 12,
  },

  progressBarBg: {
    height: 6,
    backgroundColor: "#E5E7EB",
    borderRadius: 6,
    marginBottom: 16,
    overflow: "hidden",
  },

  progressBarFill: {
    width: "40%",
    height: "100%",
    backgroundColor: "#1F3B1F",
  },

  focusBtn: {
    backgroundColor: "#1F3B1F",
    paddingVertical: 12,
    borderRadius: 24,
    alignItems: "center",
  },

  focusBtnText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "600",
  },

  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 12,
    marginHorizontal: 20,
  },

  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    paddingHorizontal: 20,
  },

  practiceCard: {
    width: "48%",
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },

  cardTitle: {
    fontSize: 15,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 6,
  },

  cardSub: {
    fontSize: 13,
    color: "#6B7280",
  },

  testGrid: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    marginBottom: 24,
  },

  testCard: {
    width: "31%",
    backgroundColor: "#FAFAFA",
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderStyle: "dashed",
    borderColor: "#E5E7EB",
  },

  progressCard: {
    marginHorizontal: 20,
    padding: 16,
    borderRadius: 16,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },

  progressTitle: {
    fontSize: 14,
    color: "#6B7280",
    marginBottom: 10,
  },

  weekRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },

  weekStat: {
    fontSize: 15,
    fontWeight: "600",
    color: "#111827",
  },
});
