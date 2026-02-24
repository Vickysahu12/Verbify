import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  StatusBar,
} from "react-native";

export default function NotificationScreen() {
  const [activeTab, setActiveTab] = useState("All");

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" backgroundColor="#F8FAFC" />

      {/* ================= HEADER ================= */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.headerBtn}>
          <Text style={styles.headerIcon}>←</Text>
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Notifications</Text>

        <TouchableOpacity style={styles.headerBtn}>
          <Text style={styles.headerIcon}>⚙</Text>
        </TouchableOpacity>
      </View>

      {/* ================= TABS ================= */}
      <View style={styles.tabsWrapper}>
        {["All", "Unread", "Important"].map((tab) => {
          const isActive = activeTab === tab;
          return (
            <TouchableOpacity
              key={tab}
              onPress={() => setActiveTab(tab)}
              style={[styles.tabPill, isActive && styles.activeTabPill]}
            >
              <Text
                style={[
                  styles.tabText,
                  isActive && styles.activeTabText,
                ]}
              >
                {tab}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 120 }}
      >
        {/* MARK ALL */}
        <View style={styles.markAllWrap}>
          <TouchableOpacity style={styles.markAllBtn}>
            <Text style={styles.markAllText}>Mark all as read</Text>
          </TouchableOpacity>
        </View>

        {/* SECTIONS */}
        <SectionTitle title="MOCK TESTS" />

        <NotificationCard
          icon="📘"
          title="VARC Sectional Mock 12 Live"
          desc="New reading comprehension focus test is now available. Time: 40 mins."
          time="10 min ago"
          unread
        />

        <NotificationCard
          icon="📊"
          title="Results: Full Mock #08"
          desc="Your performance analysis is ready. View rank now."
          time="Yesterday"
        />

        <SectionTitle title="STUDY REMINDERS" />

        <NotificationCard
          icon="⏰"
          title="Daily Vocab Practice"
          desc="Don’t break your streak! Spend 10 mins on hard words."
          time="2 hrs ago"
          unread
        />

        <NotificationCard
          icon="📝"
          title="Review Incorrect Answers"
          desc="You have 15 pending questions from last session."
          time="Yesterday"
        />

        <SectionTitle title="APP UPDATES" />

        <NotificationCard
          icon="✨"
          title="New: Dark Mode Theme"
          desc="Experience better focus with our sleek dark UI."
          time="2 days ago"
        />
      </ScrollView>
    </SafeAreaView>
  );
}

/* ================= COMPONENTS ================= */

const SectionTitle = ({ title }) => (
  <View style={styles.sectionWrap}>
    <Text style={styles.sectionText}>{title}</Text>
  </View>
);

const NotificationCard = ({ icon, title, desc, time, unread }) => (
  <View style={[styles.card, unread && styles.unreadCard]}>
    <View style={styles.iconBox}>
      <Text style={styles.iconEmoji}>{icon}</Text>
    </View>

    <View style={styles.cardContent}>
      <Text style={styles.cardTitle}>{title}</Text>
      <Text style={styles.cardDesc}>{desc}</Text>
      <Text style={styles.cardTime}>{time}</Text>
    </View>

    {unread && <View style={styles.unreadDot} />}
  </View>
);

/* ================= STYLES ================= */

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: "#F8FAFC",
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 18,
    backgroundColor: "#FFFFFF",
  },

  headerTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#0F172A",
  },

  headerBtn: {
    width: 42,
    height: 42,
    borderRadius: 14,
    backgroundColor: "#F1F5F9",
    alignItems: "center",
    justifyContent: "center",
  },

  headerIcon: {
    fontSize: 18,
  },

  tabsWrapper: {
    flexDirection: "row",
    paddingHorizontal: 20,
    marginTop: 10,
  },

  tabPill: {
    paddingHorizontal: 18,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: "#EEF2F7",
    marginRight: 12,
  },

  activeTabPill: {
    backgroundColor: "#2563EB",
  },

  tabText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#475569",
  },

  activeTabText: {
    color: "#FFFFFF",
  },

  markAllWrap: {
    alignItems: "flex-end",
    paddingHorizontal: 20,
    marginTop: 20,
  },

  markAllBtn: {
    paddingHorizontal: 14,
    paddingVertical: 6,
  },

  markAllText: {
    fontSize: 13,
    color: "#2563EB",
    fontWeight: "600",
  },

  sectionWrap: {
    paddingHorizontal: 20,
    marginTop: 30,
    marginBottom: 10,
  },

  sectionText: {
    fontSize: 13,
    fontWeight: "700",
    letterSpacing: 1,
    color: "#64748B",
  },

  card: {
    flexDirection: "row",
    alignItems: "flex-start",
    backgroundColor: "#FFFFFF",
    marginHorizontal: 20,
    marginBottom: 16,
    padding: 16,
    borderRadius: 20,
    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowRadius: 10,
    elevation: 2,
  },

  unreadCard: {
    backgroundColor: "#F0F6FF",
  },

  iconBox: {
    width: 46,
    height: 46,
    borderRadius: 14,
    backgroundColor: "#EEF2F7",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 14,
  },

  iconEmoji: {
    fontSize: 20,
  },

  cardContent: {
    flex: 1,
  },

  cardTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: "#0F172A",
  },

  cardDesc: {
    fontSize: 13,
    color: "#475569",
    marginTop: 4,
    lineHeight: 18,
  },

  cardTime: {
    fontSize: 12,
    color: "#94A3B8",
    marginTop: 8,
    fontWeight: "500",
  },

  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#2563EB",
    marginLeft: 6,
    marginTop: 4,
  },
});