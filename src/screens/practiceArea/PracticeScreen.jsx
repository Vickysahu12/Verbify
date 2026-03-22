import React, { useState, useEffect,useCallback } from "react";
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  SafeAreaView, Dimensions, RefreshControl,
  ActivityIndicator, Platform, Image,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import Backbutton from "../../assets/icon/backbutton.png";
import axios from 'axios';
import { AuthService } from '../../services/AuthService';
import { useFocusEffect } from '@react-navigation/native';
const { width } = Dimensions.get("window");
const scale = (s) => (width / 375) * s;

const api = axios.create({
  baseURL: 'http://10.182.41.220:8000',
  headers: { 'Content-Type': 'application/json' },
  timeout: 10000,
});

const DUMMY_WORD = {
  word: "Ephemeral",
  pronunciation: "/əˈfem(ə)rəl/",
  question: "Select the most accurate meaning:",
  options: ["Short-lived", "Permanent", "Transparent", "Weak"],
  correct: 0,
  explanation: "Ephemeral means lasting for a very short time.",
};

const PracticeScreen = () => {
  const navigation = useNavigation();
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [userName, setUserName] = useState("");
  const [goalData, setGoalData] = useState({ completed: 0, total: 20, streak: 0 });
  const [modules, setModules] = useState([]);

  useFocusEffect(
  useCallback(() => {
    loadData();
  }, [])
);

  const loadData = async () => {
    try {
      setIsLoading(true);
      const token = await AuthService.getToken();

      const [practiceRes, homeRes] = await Promise.all([
        api.get('/user/practice-modules', { headers: { Authorization: `Bearer ${token}` } }),
        api.get('/user/home-stats',        { headers: { Authorization: `Bearer ${token}` } }),
      ]);

      setUserName(homeRes.data.name);

      const d = practiceRes.data;
      setGoalData({
        completed: d.goal_completed,
        total:     d.goal_total,
        streak:    d.streak,
      });

      const moduleButtons = {
        vocab: [
          { label: 'Learn',    screen: 'VocabLearning' },
          { label: 'Practice', screen: 'Vocab', params: { wordData: DUMMY_WORD } }
        ],
        rc: [
          { label: 'Learn',    screen: 'RcRead' },
          { label: 'Practice', screen: 'RcDaily' }
        ],
        essay: [
          { label: 'Read',    screen: 'Article' },
          { label: 'Analyse', screen: 'ArticleDetail' }
        ],
        va: [
          { label: 'Concepts', screen: 'VaConcept' },
          { label: 'Practice', screen: 'VA' }
        ],
      };

      const tagStyles = {
        'HIGH PRIORITY': 'highPriority',
        'NEW CONTENT':   'newContent',
      };

      setModules(d.modules.map(m => ({
        id:          m.id,
        title:       m.title,
        description: m.description,
        progress:    m.progress,
        tag:         m.tag,
        tagStyle:    m.tag ? tagStyles[m.tag] : null,
        buttons:     moduleButtons[m.id] ?? [],
      })));

    } catch (error) {
      console.log('Error loading practice data:', error);
      setGoalData({ completed: 0, total: 20, streak: 0 });
      setModules([]);
    } finally {
      setIsLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  if (isLoading) {
    return (
      <SafeAreaView style={[styles.safe, styles.centerContent]}>
        <ActivityIndicator size="large" color="#1F3B1F" />
        <Text style={styles.loadingText}>Loading modules...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        stickyHeaderIndices={[0]}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={["#1F3B1F"]}
            tintColor="#1F3B1F"
          />
        }
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.backButton}
            activeOpacity={0.7}
          >
            <Image source={Backbutton} style={styles.backIcon} resizeMode="contain" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>
            Ready to Ace the CAT, {userName}?
          </Text>
          <View style={{ width: 40 }} />
        </View>

        {/* Daily Goal Tracker */}
        <View style={styles.goalCard}>
          <View style={styles.goalTop}>
            <Text style={styles.goalTitle}>Daily Goal Tracker</Text>
            <Text style={styles.goalCount}>{goalData.completed}/{goalData.total}</Text>
          </View>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: `${(goalData.completed / goalData.total) * 100}%` }]} />
          </View>
          <Text style={styles.goalSub}>
            {goalData.completed}/{goalData.total} Questions solved today. You're on a {goalData.streak}-day streak! 🔥
          </Text>
        </View>

        {/* Section Title */}
        <Text style={styles.sectionTitle}>Study Modules</Text>

        {/* Module Cards */}
        {modules.map((module) => (
          <ModuleCard key={module.id} module={module} navigation={navigation} />
        ))}

        {modules.length === 0 && (
          <View style={styles.emptyState}>
            <Text style={styles.emptyIcon}>📚</Text>
            <Text style={styles.emptyText}>No modules available</Text>
            <Text style={styles.emptySubtext}>Check back later for new content!</Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const ModuleCard = ({ module, navigation }) => (
  <View style={styles.card}>
    {module.tag && (
      <Text style={[styles.tag, styles[module.tagStyle]]}>{module.tag}</Text>
    )}
    <Text style={styles.cardTitle}>{module.title}</Text>
    <Text style={styles.cardDesc}>{module.description}</Text>
    <View style={styles.cardBottom}>
      <View style={styles.cardProgress}>
        <View style={[styles.cardProgressFill, { width: `${module.progress}%` }]} />
      </View>
      <Text style={styles.percent}>{module.progress}%</Text>
    </View>
    <View style={styles.dualCTA}>
      {module.buttons.map((button, index) => (
        <TouchableOpacity
          key={index}
          style={[styles.ctaSmall, index === 0 ? styles.ctaPrimary : styles.ctaSecondary]}
          onPress={() => button.params ? navigation.navigate(button.screen, button.params) : navigation.navigate(button.screen)}
          activeOpacity={0.8}
        >
          <Text style={index === 0 ? styles.ctaPrimaryText : styles.ctaSecondaryText}>
            {button.label}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  </View>
);

export default PracticeScreen;

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#F9FAF6", paddingHorizontal: scale(16) },
  centerContent: { justifyContent: 'center', alignItems: 'center' },
  loadingText: { marginTop: 12, fontSize: 14, color: '#6B7280' },
  header: {
    backgroundColor: "#F9FAF6", paddingVertical: scale(14),
    paddingHorizontal: scale(4), flexDirection: 'row',
    alignItems: 'center', justifyContent: 'space-between',
    paddingTop: Platform.OS === 'ios' ? scale(10) : scale(30),
  },
  backButton: { width: 40, height: 40, justifyContent: "center", alignItems: "center" },
  backIcon: { width: 22, height: 22 },
  headerTitle: { flex: 1, fontSize: scale(16), fontWeight: "700", color: "#1F3B1F", textAlign: 'center' },
  goalCard: {
    backgroundColor: "#FFFFFF", borderRadius: scale(14),
    padding: scale(16), marginBottom: scale(20), marginTop: 5,
    elevation: 3,
  },
  goalTop: { flexDirection: "row", justifyContent: "space-between", marginBottom: scale(8) },
  goalTitle: { fontSize: scale(14), fontWeight: "600", color: "#1F3B1F" },
  goalCount: { fontSize: scale(14), fontWeight: "700", color: "#1F3B1F" },
  goalSub: { fontSize: scale(12), color: "#6B7280", marginTop: scale(8) },
  progressBar: { height: 6, backgroundColor: "#E5E7EB", borderRadius: 6, overflow: "hidden" },
  progressFill: { height: "100%", backgroundColor: "#1F3B1F" },
  sectionTitle: { fontSize: scale(16), fontWeight: "700", color: "#1F3B1F", marginBottom: scale(12) },
  card: { backgroundColor: "#FFFFFF", borderRadius: scale(16), padding: scale(16), marginBottom: scale(20), elevation: 4 },
  tag: { alignSelf: "flex-start", fontSize: scale(10), fontWeight: "700", paddingHorizontal: scale(10), paddingVertical: scale(3), borderRadius: 20, marginBottom: scale(10) },
  highPriority: { backgroundColor: "#FEF3C7", color: "#92400E" },
  newContent: { backgroundColor: "#DCFCE7", color: "#166534" },
  cardTitle: { fontSize: scale(16), fontWeight: "700", color: "#0F172A", marginBottom: scale(6) },
  cardDesc: { fontSize: scale(13), color: "#4B5563", marginBottom: scale(14), lineHeight: scale(18) },
  cardBottom: { flexDirection: "row", alignItems: "center", marginBottom: scale(14) },
  cardProgress: { flex: 1, height: 6, backgroundColor: "#E5E7EB", borderRadius: 6, overflow: "hidden" },
  cardProgressFill: { height: "100%", backgroundColor: "#1F3B1F" },
  percent: { marginLeft: scale(8), fontSize: scale(12), fontWeight: "600", color: "#1F3B1F" },
  dualCTA: { flexDirection: "row", gap: scale(12) },
  ctaSmall: { flex: 1, paddingVertical: scale(12), borderRadius: scale(10), alignItems: "center" },
  ctaPrimary: { backgroundColor: "#1F3B1F", elevation: 3 },
  ctaSecondary: { backgroundColor: "#FFFFFF", borderWidth: 1.5, borderColor: "#1F3B1F" },
  ctaPrimaryText: { color: "#FFFFFF", fontSize: scale(14), fontWeight: "700" },
  ctaSecondaryText: { color: "#1F3B1F", fontSize: scale(14), fontWeight: "700" },
  emptyState: { alignItems: 'center', paddingVertical: 60 },
  emptyIcon: { fontSize: 64, marginBottom: 16 },
  emptyText: { fontSize: 18, fontWeight: '700', color: '#111827', marginBottom: 8 },
  emptySubtext: { fontSize: 14, color: '#6B7280', textAlign: 'center' },
});