import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
} from "react-native";

import VocabScreen from "./vocab/VocabScreen";
import RCScreen from "./RC/RcScreen";
import ArticleScreen from "./Article/ArticleScreen";
import VaScreen from "./VA/VaScreen";

const PracticeScreen = () => {
  const [activeTab, setActiveTab] = useState("Vocab");

  const tabs = [
    { name: "Vocab", icon: require("../../assets/icon/Vocab.png") },
    { name: "RC", icon: require("../../assets/icon/RC.png") },
    { name: "Article", icon: require("../../assets/icon/verbal.png") },
    { name: "VA", icon: require("../../assets/icon/VA.png") },
  ];

  return (
    <View style={styles.container}>
      {/* 🔹 Motivation (ONLY Vocab & RC) */}
      {activeTab !== "Article" && activeTab !== "VA" && (
        <Text style={styles.motivation}>
          Small steps daily. Big CAT score later.
        </Text>
      )}

      {/* 🔹 Tabs (ONLY Vocab & RC) */}
      {activeTab !== "Article" && activeTab !== "VA" && (
        <View style={styles.tabRow}>
          {tabs.map((tab) => {
            const isActive = activeTab === tab.name;

            return (
              <TouchableOpacity
                key={tab.name}
                style={styles.tabItem}
                activeOpacity={0.7}
                onPress={() => setActiveTab(tab.name)}
              >
                <Image
                  source={tab.icon}
                  style={[
                    styles.tabIcon,
                    { opacity: isActive ? 1 : 0.4 },
                  ]}
                  resizeMode="contain"
                />

                <Text
                  style={[
                    styles.tabText,
                    isActive && styles.activeText,
                  ]}
                >
                  {tab.name}
                </Text>

                {isActive && <View style={styles.activeLine} />}
              </TouchableOpacity>
            );
          })}
        </View>
      )}

      {/* 🔹 CONTENT */}
      {activeTab === "Article" ? (
        <ArticleScreen onBack={() => setActiveTab("Vocab")} />
      ) : (
        <ScrollView
          showsVerticalScrollIndicator={false}
          style={{ marginTop: 2 }}
        >
          {activeTab === "Vocab" && <VocabScreen />}
          {activeTab === "RC" && <RCScreen />}
          {activeTab === "VA" && <VaScreen />}
        </ScrollView>
      )}
    </View>
  );
};

export default PracticeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9FAF6",
    paddingTop: 50,
    paddingHorizontal: 20,
  },

  motivation: {
    fontSize: 14,
    color: "#374151",
    textAlign: "center",
    marginBottom: 18,
    fontWeight: "500",
  },

  tabRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },

  tabItem: {
    alignItems: "center",
    flex: 1,
  },

  tabText: {
    fontSize: 12,
    marginTop: 4,
    color: "#9CA3AF",
    fontWeight: "500",
  },

  activeText: {
    color: "#1F3B1F",
    fontWeight: "600",
  },

  activeLine: {
    marginTop: 6,
    height: 2,
    width: 24,
    backgroundColor: "#1F3B1F",
    borderRadius: 2,
  },

  tabIcon: {
    width: 22,
    height: 22,
    marginBottom: 2,
  },
});
