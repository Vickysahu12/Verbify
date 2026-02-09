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
        contentContainerStyle={{ paddingBottom: 140 }}
      >
        <View style={{ height: 110 }} />

        {/* 🔹 HERO READINESS CARD */}
        <View style={styles.heroCard}>
          <View>
            <Text style={styles.heroLabel}>CAT Readiness</Text>
            <Text style={styles.heroScore}>68%</Text>
            <Text style={styles.heroDelta}>+4% this week</Text>
          </View>

          <View style={styles.heroRight}>
            <View style={styles.heroMini}>
              <Text style={styles.heroMiniValue}>🔥 15</Text>
              <Text style={styles.heroMiniLabel}>Day Streak</Text>
            </View>

            <View style={styles.heroMini}>
              <Text style={styles.heroMiniValue}>📘 450</Text>
              <Text style={styles.heroMiniLabel}>Words</Text>
            </View>
          </View>
        </View>

        {/* 🔹 TODAY'S FOCUS */}
        <View style={styles.focusCard}>
          <Text style={styles.focusTitle}>Today's Focus</Text>
          <Text style={styles.focusDesc}>
            VARC Practice • 70 minutes
          </Text>

          <Text style={styles.focusProgress}>40% completed</Text>

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
          <PracticeCard icon="🔤" title="Vocabulary" subtitle="10 / 20 words" />
          <PracticeCard icon="📘" title="Reading" subtitle="12 min article" />
          <PracticeCard icon="📄" title="RC Practice" subtitle="2 passages" />
          <PracticeCard icon="🧩" title="VA Practice" subtitle="Para Jumble • OOO" />
        </View>

        {/* 🔹 TESTS */}
        <Text style={styles.sectionTitle}>Tests</Text>
        <View style={styles.testGrid}>
          <TestCard title="RC Test" status="Not attempted" />
          <TestCard title="Vocab Test" status="Avg 62%" />
          <TestCard title="VA Test" status="Last: 2 days ago" />
        </View>

        {/* 🔹 WEEKLY SNAPSHOT */}
        <View style={styles.progressCard}>
          <Text style={styles.progressTitle}>This Week</Text>

          <View style={styles.weekRow}>
            <Text style={styles.weekStat}>⏱ 4h 20m studied</Text>
            <Text style={styles.weekStat}>🔥 3-day streak</Text>
          </View>

          <View style={styles.weekDots}>
            {[1, 2, 3, 4, 5, 6, 7].map((_, i) => (
              <View
                key={i}
                style={[
                  styles.dot,
                  i === 3 && { backgroundColor: "#1F3B1F" },
                ]}
              />
            ))}
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

export default HomeScreen;

/* 🔹 COMPONENTS */

const PracticeCard = ({ icon, title, subtitle }) => (
  <TouchableOpacity style={styles.practiceCard}>
    <Text style={styles.practiceIcon}>{icon}</Text>
    <Text style={styles.cardTitle}>{title}</Text>
    <Text style={styles.cardSub}>{subtitle}</Text>
  </TouchableOpacity>
);

const TestCard = ({ title, status }) => (
  <TouchableOpacity style={styles.testCard}>
    <Text style={styles.cardTitle}>{title}</Text>
    <Text style={styles.testStatus}>{status}</Text>
  </TouchableOpacity>
);

/* 🔹 STYLES */

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: "#F9FAF6",
  },

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

  /* HERO */
  heroCard: {
    marginHorizontal: 20,
    padding: 20,
    borderRadius: 20,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 28,
  },

  heroLabel: {
    fontSize: 13,
    color: "#6B7280",
  },

  heroScore: {
    fontSize: 34,
    fontWeight: "700",
    color: "#111827",
  },

  heroDelta: {
    fontSize: 13,
    color: "#16A34A",
    marginTop: 2,
  },

  heroRight: {
    justifyContent: "space-between",
  },

  heroMini: {
    alignItems: "flex-end",
  },

  heroMiniValue: {
    fontSize: 16,
    fontWeight: "600",
    color:"#000"
  },

  heroMiniLabel: {
    fontSize: 12,
    color: "#6B7280",
  },

  /* FOCUS */
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
  },

  focusProgress: {
    fontSize: 12,
    color: "#6B7280",
    marginVertical: 8,
  },

  progressBarBg: {
    height: 8,
    backgroundColor: "#E5E7EB",
    borderRadius: 8,
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

  practiceIcon: {
    fontSize: 22,
    marginBottom: 6,
  },

  cardTitle: {
    fontSize: 15,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 4,
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

  testStatus: {
    fontSize: 12,
    color: "#6B7280",
    marginTop: 4,
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

  weekDots: {
    flexDirection: "row",
    marginTop: 12,
  },

  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#E5E7EB",
    marginRight: 6,
  },
});
