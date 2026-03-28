import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  View, Text, StyleSheet, ScrollView,
  TouchableOpacity, StatusBar, Platform,
  Dimensions, Animated,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRoute, useNavigation } from '@react-navigation/native';
import axios from 'axios';
import { AuthService } from '../../../services/AuthService';

const { width: SW } = Dimensions.get('window');
const sc = n => (SW / 390) * n;

const api = axios.create({
  baseURL: 'http://https://web-production-4c19b.up.railway.app:8000',
  headers: { 'Content-Type': 'application/json' },
  timeout: 10000,
});

// ─── DESIGN TOKENS ────────────────────────────────────────────────────────────
const C = {
  primary:      '#1F3B1F',
  primaryLight: '#E8F5EE',
  primaryMid:   '#2EA86B',
  primarySoft:  '#F0FAF5',
  surface:      '#FFFFFF',
  bg:           '#F6F8F7',
  border:       '#E8EDEA',
  text:         '#0D1F15',
  sub:          '#527A62',
  muted:        '#9DB5A5',
  correct:      '#16A34A',
  correctBg:    '#DCFCE7',
  wrong:        '#DC2626',
  gold:         '#D97706',
  goldSoft:     '#FEF3C7',
  shadow:       '#0D1F15',
};

const LEVEL_CFG = {
  Easy:   { color: C.correct, bg: C.correctBg },
  Medium: { color: C.gold,    bg: C.goldSoft  },
  Hard:   { color: C.wrong,   bg: '#FEE2E2'   },
};

// ─── SKELETON ────────────────────────────────────────────────────────────────
const SkeletonPulse = ({ style }) => {
  const anim = useRef(new Animated.Value(0.4)).current;
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(anim, { toValue: 1,   duration: 750, useNativeDriver: true }),
        Animated.timing(anim, { toValue: 0.4, duration: 750, useNativeDriver: true }),
      ])
    ).start();
  }, []);
  return <Animated.View style={[{ backgroundColor: C.border, opacity: anim }, style]} />;
};

const ArticleReadSkeleton = () => (
  <View style={{ gap: sc(14), paddingTop: sc(8) }}>
    <View style={{ flexDirection: 'row', gap: sc(8) }}>
      <SkeletonPulse style={{ width: sc(80),  height: sc(22), borderRadius: sc(11) }} />
      <SkeletonPulse style={{ width: sc(60),  height: sc(22), borderRadius: sc(11) }} />
    </View>
    <SkeletonPulse style={{ width: '90%', height: sc(28), borderRadius: sc(8) }} />
    <SkeletonPulse style={{ width: '70%', height: sc(28), borderRadius: sc(8) }} />
    <View style={{ height: sc(1), backgroundColor: C.border, marginVertical: sc(8) }} />
    {[0, 1, 2, 3, 4].map(i => (
      <View key={i} style={{ gap: sc(6) }}>
        <SkeletonPulse style={{ width: '100%', height: sc(14), borderRadius: sc(6) }} />
        <SkeletonPulse style={{ width: '100%', height: sc(14), borderRadius: sc(6) }} />
        <SkeletonPulse style={{ width: '75%',  height: sc(14), borderRadius: sc(6) }} />
      </View>
    ))}
  </View>
);

// ─── MAIN SCREEN ─────────────────────────────────────────────────────────────
const ArticleReadScreen = () => {
  const route      = useRoute();
  const navigation = useNavigation();
  const { articleId } = route.params || {};

  const [article,        setArticle]        = useState(null);
  const [loading,        setLoading]        = useState(true);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isBookmarked,   setIsBookmarked]   = useState(false);
  const [markedRead,     setMarkedRead]     = useState(false);
  const [showCTA,        setShowCTA]        = useState(false);

  const backScale  = useRef(new Animated.Value(1)).current;
  const ctaAnim    = useRef(new Animated.Value(0)).current;
  const startTime  = useRef(Date.now());

  useEffect(() => {
    loadArticle();
    return () => {
      // Track read time on unmount
      const elapsed = Math.round((Date.now() - startTime.current) / 1000);
      if (elapsed > 5) trackTime(elapsed);
    };
  }, [articleId]);

  // ── Load article ────────────────────────────────────────────────────────
  const loadArticle = async () => {
    try {
      setLoading(true);
      const token = await AuthService.getToken();
      const res   = await api.get(`/articles/${articleId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setArticle(res.data);
      setIsBookmarked(res.data.is_bookmarked ?? false);
      setMarkedRead(res.data.is_read ?? false);
    } catch (err) {
      console.log('ArticleRead load error:', err);
      setArticle(null);
    } finally {
      setLoading(false);
    }
  };

  // ── Track time on backend ───────────────────────────────────────────────
  const trackTime = async (seconds) => {
    try {
      const token = await AuthService.getToken();
      await api.post(`/articles/${articleId}/time`,
        { seconds_spent: seconds },
        { headers: { Authorization: `Bearer ${token}` } }
      );
    } catch (err) {
      console.log('Track time error (ignored):', err);
    }
  };

  // ── Scroll handler ──────────────────────────────────────────────────────
  const handleScroll = useCallback(async (event) => {
    const { layoutMeasurement, contentOffset, contentSize } = event.nativeEvent;
    const raw      = contentOffset.y / (contentSize.height - layoutMeasurement.height);
    const progress = Math.min(Math.max(raw, 0), 1);
    setScrollProgress(progress);

    // Show CTA at 85%
    if (progress >= 0.85 && !showCTA) {
      setShowCTA(true);
      Animated.spring(ctaAnim, { toValue: 1, useNativeDriver: true, speed: 14, bounciness: 6 }).start();
    } else if (progress < 0.85 && showCTA) {
      setShowCTA(false);
      Animated.timing(ctaAnim, { toValue: 0, duration: 200, useNativeDriver: true }).start();
    }

    // Mark read at 90%
    if (progress >= 0.9 && !markedRead) {
      setMarkedRead(true);
      try {
        const token = await AuthService.getToken();
        await api.post(`/articles/${articleId}/read`, {}, {
          headers: { Authorization: `Bearer ${token}` }
        });
      } catch (err) {
        console.log('Mark read error (ignored):', err);
      }
    }
  }, [showCTA, markedRead, articleId]);

  // ── Bookmark ────────────────────────────────────────────────────────────
  const handleBookmark = useCallback(async () => {
    try {
      const token = await AuthService.getToken();
      const res   = await api.post(`/articles/${articleId}/bookmark`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setIsBookmarked(res.data.is_bookmarked);
    } catch (err) {
      console.log('Bookmark error:', err);
      setIsBookmarked(prev => !prev); // optimistic
    }
  }, [articleId]);

  // ── Back ────────────────────────────────────────────────────────────────
  const handleBack = useCallback(() => {
    Animated.sequence([
      Animated.timing(backScale, { toValue: 0.85, duration: 70, useNativeDriver: true }),
      Animated.timing(backScale, { toValue: 1,    duration: 70, useNativeDriver: true }),
    ]).start(() => navigation.goBack());
  }, [navigation]);

  // ── Not found ───────────────────────────────────────────────────────────
  if (!loading && !article) {
    return (
      <SafeAreaView style={s.safe}>
        <View style={s.errorWrap}>
          <Text style={s.errorEmoji}>📭</Text>
          <Text style={s.errorTitle}>Article not found</Text>
          <Text style={s.errorSub}>This article may have been removed.</Text>
          <TouchableOpacity style={s.errorBtn} onPress={() => navigation.goBack()}>
            <Text style={s.errorBtnText}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const lvl = LEVEL_CFG[article?.level] ?? LEVEL_CFG.Medium;

  return (
    <SafeAreaView style={s.safe} edges={['top']}>
      <StatusBar barStyle="dark-content" backgroundColor={C.bg} />

      {/* ── NAVBAR ── */}
      <View style={s.navbar}>
        <Animated.View style={{ transform: [{ scale: backScale }] }}>
          <TouchableOpacity onPress={handleBack} style={s.navBtn}
            hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}>
            <Text style={s.navBackIcon}>‹</Text>
          </TouchableOpacity>
        </Animated.View>
        <View style={s.navCenter}>
          <Text style={s.navEyebrow}>ARTICLE READING</Text>
          <Text style={s.navSub}>CAT Prep Series</Text>
        </View>
        <TouchableOpacity onPress={handleBookmark} style={s.navBtn}
          hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}>
          <Text style={[s.navBookmarkIcon, { opacity: isBookmarked ? 1 : 0.4 }]}>🔖</Text>
        </TouchableOpacity>
      </View>

      {/* ── PROGRESS BAR ── */}
      <View style={s.progressBg}>
        <View style={[s.progressFill, { width: `${scrollProgress * 100}%` },
          markedRead && s.progressFillDone]} />
      </View>

      {/* ── CONTENT ── */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        contentContainerStyle={s.scroll}
      >
        {loading ? <ArticleReadSkeleton /> : (
          <>
            {/* Article header */}
            <View style={s.articleHeader}>
              <View style={s.metaRow}>
                <View style={s.tagPill}><Text style={s.tagText}>{article.tag}</Text></View>
                <View style={[s.levelPill, { backgroundColor: lvl.bg }]}>
                  <Text style={[s.levelText, { color: lvl.color }]}>{article.level}</Text>
                </View>
                {markedRead && (
                  <View style={s.readPill}><Text style={s.readPillText}>✓ Read</Text></View>
                )}
              </View>

              <Text style={s.articleTitle}>{article.title}</Text>

              <View style={s.articleMetaRow}>
                <View style={s.articleMetaItem}>
                  <Text style={s.articleMetaIcon}>📰</Text>
                  <Text style={s.articleMetaText} numberOfLines={1}>
                    {article.meta?.split('•')[0]?.trim()}
                  </Text>
                </View>
                <View style={s.articleMetaDot} />
                <View style={s.articleMetaItem}>
                  <Text style={s.articleMetaIcon}>⏱</Text>
                  <Text style={s.articleMetaText}>{article.meta?.split('•')[1]?.trim()}</Text>
                </View>
              </View>

              <View style={s.readProgressRow}>
                <Text style={s.readProgressLabel}>Reading progress</Text>
                <Text style={s.readProgressPct}>{Math.round(scrollProgress * 100)}%</Text>
              </View>
            </View>

            <View style={s.contentDivider} />

            {/* Body */}
            <View style={s.articleBody}>
              {(article.content ?? []).map((para, idx) => (
                <Text key={idx} style={s.paragraph}>{para}</Text>
              ))}
            </View>

            {/* Completion badge */}
            {markedRead && (
              <View style={s.completionCard}>
                <Text style={s.completionEmoji}>✅</Text>
                <View>
                  <Text style={s.completionTitle}>Article Complete!</Text>
                  <Text style={s.completionSub}>Great work. Ready to analyze?</Text>
                </View>
              </View>
            )}

            {/* Bottom CTA */}
            <Animated.View style={{
              opacity: ctaAnim,
              transform: [{ translateY: ctaAnim.interpolate({ inputRange: [0, 1], outputRange: [sc(20), 0] }) }],
              marginTop: sc(16),
            }}>
              <TouchableOpacity style={s.ctaBtn} activeOpacity={0.88}
                onPress={() => navigation.navigate('ArticleDetail', { articleId: article.id })}>
                <View>
                  <Text style={s.ctaBtnLabel}>NEXT STEP</Text>
                  <Text style={s.ctaBtnTitle}>Analyze This Passage →</Text>
                </View>
                <View style={s.ctaBtnIcon}><Text style={s.ctaBtnIconText}>🧠</Text></View>
              </TouchableOpacity>
            </Animated.View>

            <View style={{ height: sc(48) }} />
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default ArticleReadScreen;

// ─── STYLES ──────────────────────────────────────────────────────────────────
const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: C.bg },
  navbar: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: sc(16), paddingVertical: sc(10), backgroundColor: C.bg },
  navBtn: { width: sc(38), height: sc(38), borderRadius: sc(12), backgroundColor: C.surface, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: C.border, elevation: 2 },
  navBackIcon: { fontSize: sc(24), color: C.text, lineHeight: sc(28), marginTop: -sc(1) },
  navBookmarkIcon: { fontSize: sc(17) },
  navCenter: { alignItems: 'center' },
  navEyebrow: { fontSize: sc(10), fontWeight: '700', color: C.primary, letterSpacing: 1.2 },
  navSub: { fontSize: sc(11), fontWeight: '500', color: C.muted, marginTop: sc(1) },
  progressBg: { height: sc(3), backgroundColor: C.border },
  progressFill: { height: '100%', backgroundColor: C.primaryMid, borderRadius: sc(2) },
  progressFillDone: { backgroundColor: C.correct },
  scroll: { paddingHorizontal: sc(20), paddingTop: sc(20), paddingBottom: sc(40) },
  articleHeader: { marginBottom: sc(20) },
  metaRow: { flexDirection: 'row', alignItems: 'center', gap: sc(8), marginBottom: sc(14), flexWrap: 'wrap' },
  tagPill: { backgroundColor: C.primaryLight, paddingHorizontal: sc(10), paddingVertical: sc(5), borderRadius: sc(9) },
  tagText: { fontSize: sc(10), fontWeight: '800', color: C.primary, letterSpacing: 0.5 },
  levelPill: { paddingHorizontal: sc(9), paddingVertical: sc(5), borderRadius: sc(9) },
  levelText: { fontSize: sc(10), fontWeight: '700' },
  readPill: { backgroundColor: C.correctBg, paddingHorizontal: sc(9), paddingVertical: sc(5), borderRadius: sc(9) },
  readPillText: { fontSize: sc(10), fontWeight: '800', color: C.correct },
  articleTitle: { fontSize: SW < 380 ? sc(22) : sc(26), fontWeight: '800', color: C.text, lineHeight: sc(34), letterSpacing: -0.5, marginBottom: sc(14) },
  articleMetaRow: { flexDirection: 'row', alignItems: 'center', gap: sc(8), marginBottom: sc(14) },
  articleMetaItem: { flexDirection: 'row', alignItems: 'center', gap: sc(4) },
  articleMetaIcon: { fontSize: sc(12) },
  articleMetaText: { fontSize: sc(12), color: C.sub, fontWeight: '500', maxWidth: sc(120) },
  articleMetaDot: { width: sc(3), height: sc(3), borderRadius: sc(2), backgroundColor: C.muted },
  readProgressRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: C.primarySoft, borderRadius: sc(10), paddingHorizontal: sc(12), paddingVertical: sc(8), borderWidth: 1, borderColor: C.primaryLight },
  readProgressLabel: { fontSize: sc(11), fontWeight: '600', color: C.sub },
  readProgressPct: { fontSize: sc(12), fontWeight: '800', color: C.primary },
  contentDivider: { height: 1, backgroundColor: C.border, marginBottom: sc(24) },
  articleBody: { gap: sc(4) },
  paragraph: { fontSize: sc(16), lineHeight: sc(28), color: '#2D3F30', letterSpacing: 0.2, marginBottom: sc(18), fontWeight: '400' },
  completionCard: { flexDirection: 'row', alignItems: 'center', gap: sc(12), backgroundColor: C.correctBg, borderRadius: sc(16), padding: sc(16), marginTop: sc(8), borderWidth: 1, borderColor: '#BBF7D0' },
  completionEmoji: { fontSize: sc(28) },
  completionTitle: { fontSize: sc(15), fontWeight: '800', color: C.correct },
  completionSub: { fontSize: sc(12), fontWeight: '500', color: '#166534', marginTop: sc(2) },
  ctaBtn: { backgroundColor: C.primary, borderRadius: sc(18), padding: sc(18), flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', elevation: 8 },
  ctaBtnLabel: { fontSize: sc(9), fontWeight: '700', color: '#7BA882', letterSpacing: 1.2, marginBottom: sc(4) },
  ctaBtnTitle: { fontSize: sc(16), fontWeight: '800', color: '#fff', letterSpacing: -0.2 },
  ctaBtnIcon: { width: sc(44), height: sc(44), borderRadius: sc(13), backgroundColor: 'rgba(255,255,255,0.15)', alignItems: 'center', justifyContent: 'center' },
  ctaBtnIconText: { fontSize: sc(22) },
  errorWrap: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: sc(32), gap: sc(10) },
  errorEmoji: { fontSize: sc(42) },
  errorTitle: { fontSize: sc(18), fontWeight: '800', color: C.text },
  errorSub: { fontSize: sc(13), color: C.muted, textAlign: 'center' },
  errorBtn: { marginTop: sc(8), backgroundColor: C.primary, paddingHorizontal: sc(24), paddingVertical: sc(12), borderRadius: sc(12) },
  errorBtnText: { fontSize: sc(14), fontWeight: '800', color: '#fff' },
  
});