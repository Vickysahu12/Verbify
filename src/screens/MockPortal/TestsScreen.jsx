import React, { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, FlatList,
  TouchableOpacity, StatusBar, Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import MockCard from './componentss/MockCard';
import CategoryFilter from './componentss/CategoryFilters';

import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width: SW } = Dimensions.get('window');
const sc = n => (SW / 390) * n;

// ─── THEME ───────────────────────────────────────────────────────────────────
const C = {
  primary:     '#1F3B1F',
  surface:     '#FFFFFF',
  surfaceAlt:  '#FFFFFF',
  border:      '#E0EDE6',
  borderLight: '#EEF6F1',
  textPrimary: '#0D1F15',
  textMuted:   '#9DB5A5',
};

// ─── API SETUP ───────────────────────────────────────────────────────────────
const BASE_URL = 'https://lingolift-backend.onrender.com';

const api = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' },
});

// token attach
api.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ─── MAIN SCREEN ─────────────────────────────────────────────────────────────
const MockListScreen = ({ navigation }) => {
  const [activeFilter, setActiveFilter] = useState('all');
  const [mocks, setMocks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMocks();
  }, [activeFilter]);

  const fetchMocks = async () => {
    try {
      setLoading(true);

      const res = await api.get('/mocks', {
        params: activeFilter === 'all' ? {} : { type: activeFilter },
      });

      // 🔥 Backend → Frontend mapping
      const formatted = res.data.map(m => ({
        id: m.id,
        title: m.title,
        subtitle: m.subtitle || 'Mock Test',
        type: m.type,
        questions: m.total_questions,
        duration: `${m.duration_minutes} min`,
        attempts: m.attempts || null,
        badge: m.badge || null,
        icon: '📋',
        isAttempted: !!m.last_score,
        lastScore: m.last_score,
        maxScore: m.max_score,
        difficulty: m.difficulty || 'Medium',
      }));

      setMocks(formatted);

    } catch (err) {
      console.log('❌ Error fetching mocks:', err);
    } finally {
      setLoading(false);
    }
  };

  const counts = {
    all: mocks.length,
    full: mocks.filter(m => m.type === 'full').length,
    half: mocks.filter(m => m.type === 'half').length,
    topic: mocks.filter(m => m.type === 'topic').length,
  };

  const handleStartTest = item => {
    navigation?.navigate('MockDetail', { mockId: item.id });
  };

  // 🔥 Loading UI
  if (loading) {
    return (
      <SafeAreaView style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Loading mocks...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={s.safe} edges={['top']}>
      <StatusBar barStyle="dark-content" backgroundColor={C.surface} />

      {/* NAVBAR */}
      <View style={s.navbar}>
        <TouchableOpacity
          style={s.backBtn}
          onPress={() => navigation?.goBack()}
        >
          <View style={s.backIconWrap}>
            <Text style={s.backIcon}>‹</Text>
          </View>
        </TouchableOpacity>

        <View style={s.navCenter} pointerEvents="none">
          <Text style={s.navTitle}>Mock Tests</Text>
        </View>

        <View style={s.navRight} />
      </View>

      {/* FILTER */}
      <CategoryFilter
        activeFilter={activeFilter}
        onFilterChange={setActiveFilter}
        counts={counts}
      />

      {/* LIST */}
      <FlatList
        data={mocks}
        keyExtractor={item => item.id}
        renderItem={({ item, index }) => (
          <MockCard item={item} onPress={handleStartTest} index={index} />
        )}
        contentContainerStyle={s.listContent}
        showsVerticalScrollIndicator={false}
        ItemSeparatorComponent={() => <View style={{ height: sc(14) }} />}
        ListEmptyComponent={
          <View style={s.emptyWrap}>
            <Text style={s.emptyIcon}>🔍</Text>
            <Text style={s.emptyTitle}>No tests found</Text>
            <Text style={s.emptySubtitle}>Try a different category</Text>
          </View>
        }
      />
    </SafeAreaView>
  );
};

// ─── STYLES ──────────────────────────────────────────────────────────────────
const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: C.surfaceAlt },

  navbar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: C.surface,
    paddingHorizontal: sc(16),
    paddingTop: sc(10),
    paddingBottom: sc(12),
    borderBottomWidth: 1,
    borderBottomColor: C.border,
  },
  backBtn: { width: sc(36) },
  backIconWrap: {
    width: sc(34), height: sc(34),
    borderRadius: sc(10),
    backgroundColor: C.surfaceAlt,
    borderWidth: 1, borderColor: C.border,
    justifyContent: 'center', alignItems: 'center',
  },
  backIcon: { fontSize: sc(22), color: C.textPrimary },

  navCenter: {
    position: 'absolute',
    left: 0, right: 0,
    alignItems: 'center',
  },
  navTitle: {
    fontSize: sc(17), fontWeight: '800',
    color: C.textPrimary,
  },

  navRight: { width: sc(36) },

  listContent: {
    paddingHorizontal: sc(16),
    paddingTop: sc(16),
    paddingBottom: sc(40),
  },

  emptyWrap: {
    alignItems: 'center',
    paddingTop: sc(80),
  },
  emptyIcon: { fontSize: sc(38) },
  emptyTitle: { fontSize: sc(16), fontWeight: '700' },
  emptySubtitle: { fontSize: sc(13), color: C.textMuted },
});

export default MockListScreen;