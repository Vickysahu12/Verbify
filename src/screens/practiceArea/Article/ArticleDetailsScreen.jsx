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
  baseURL: 'https://web-production-4c19b.up.railway.app',
  headers: { 'Content-Type': 'application/json' },
  timeout: 10000,
});

// ─── DESIGN TOKENS ────────────────────────────────────────────────────────────
const C = {
  primary:      '#1F3B1F',
  primaryLight: '#E8F5EE',
  primaryMid:   '#1F3B1F',
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

const AnalysisSkeleton = () => (
  <View style={{ gap: sc(16), paddingTop: sc(8) }}>
    <SkeletonPulse style={{ width: sc(120), height: sc(10), borderRadius: sc(5) }} />
    <SkeletonPulse style={{ width: '80%',  height: sc(24), borderRadius: sc(8) }} />
    <View style={{ flexDirection: 'row', justifyContent: 'space-between', gap: sc(10) }}>
      {[0,1,2,3].map(i => (
        <SkeletonPulse key={i} style={{ flex: 1, height: sc(72), borderRadius: sc(14) }} />
      ))}
    </View>
    {[0, 1, 2, 3].map(i => (
      <SkeletonPulse key={i} style={{ height: sc(110), borderRadius: sc(18) }} />
    ))}
  </View>
);

// ─── SECTION CARD ────────────────────────────────────────────────────────────
const SectionCard = ({ children, style }) => (
  <View style={[s.card, style]}>{children}</View>
);

const CardTitle = ({ icon, title }) => (
  <View style={s.cardTitleRow}>
    <View style={s.cardTitleIconWrap}>
      <Text style={s.cardTitleIcon}>{icon}</Text>
    </View>
    <Text style={s.cardTitleText}>{title}</Text>
  </View>
);

// ─── MAIN SCREEN ─────────────────────────────────────────────────────────────
const ArticleAnalyzeScreen = () => {
  const route      = useRoute();
  const navigation = useNavigation();
  const { articleId } = route.params || {};

  const [article,    setArticle]    = useState(null);
  const [loading,    setLoading]    = useState(true);
  const [activeTone, setActiveTone] = useState(null);

  const backScale = useRef(new Animated.Value(1)).current;
  const scoreAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => { loadData(); }, [articleId]);

  // ── Load article + analysis from backend ─────────────────────────────────
  const loadData = async () => {
    try {
      setLoading(true);
      const token = await AuthService.getToken();
      const res   = await api.get(`/articles/${articleId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setArticle(res.data);
      setActiveTone(res.data?.analysis?.tone?.main ?? null);
    } catch (err) {
      console.log('ArticleAnalyze load error:', err);
      setArticle(null);
    } finally {
      setLoading(false);
    }
  };

  // Score bar animation
  useEffect(() => {
    if (article?.analysis?.score != null) {
      Animated.timing(scoreAnim, {
        toValue: article.analysis.score,
        duration: 1000, delay: 400,
        useNativeDriver: false,
      }).start();
    }
  }, [article]);

  const handleBack = useCallback(() => {
    Animated.sequence([
      Animated.timing(backScale, { toValue: 0.85, duration: 70, useNativeDriver: true }),
      Animated.timing(backScale, { toValue: 1,    duration: 70, useNativeDriver: true }),
    ]).start(() => navigation.goBack());
  }, [navigation]);

  // ── Guards ───────────────────────────────────────────────────────────────
  if (!loading && !article) {
    return (
      <SafeAreaView style={s.safe}>
        <View style={s.errorWrap}>
          <Text style={s.errorEmoji}>📖</Text>
          <Text style={s.errorTitle}>Read the article first</Text>
          <Text style={s.errorSub}>Complete the article before viewing its analysis.</Text>
          <TouchableOpacity style={s.errorBtn} onPress={() => navigation.goBack()}>
            <Text style={s.errorBtnText}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  if (!loading && article && !article.analysis) {
    return (
      <SafeAreaView style={s.safe}>
        <View style={s.errorWrap}>
          <Text style={s.errorEmoji}>🔧</Text>
          <Text style={s.errorTitle}>Analysis coming soon</Text>
          <Text style={s.errorSub}>Our team is preparing this article's analysis.</Text>
          <TouchableOpacity style={s.errorBtn} onPress={() => navigation.goBack()}>
            <Text style={s.errorBtnText}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const analysis = article?.analysis;
  const lvlCfg   = LEVEL_CFG[analysis?.difficulty] ?? LEVEL_CFG.Medium;

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
          <Text style={s.navEyebrow}>VARC ANALYSIS</Text>
          <Text style={s.navSub}>Passage Breakdown</Text>
        </View>
        {!loading && (
          <View style={[s.navDiffBadge, { backgroundColor: lvlCfg.bg }]}>
            <Text style={[s.navDiffText, { color: lvlCfg.color }]}>
              {analysis?.difficulty ?? '—'}
            </Text>
          </View>
        )}
      </View>

      <ScrollView showsVerticalScrollIndicator={false}
        stickyHeaderIndices={loading ? [] : [1]}
        contentContainerStyle={s.scroll}>
        {loading ? <AnalysisSkeleton /> : (
          <>
            <View />

            {/* ── STICKY SCORE HEADER ── */}
            <View style={s.stickyHeader}>
              <Text style={s.articleTitle} numberOfLines={2}>{article.title}</Text>
              <View style={s.scoreRow}>
                <View style={s.scoreLeft}>
                  <Text style={s.scoreReadLabel}>Reading Complete ✓</Text>
                  <Text style={s.scoreValue}>{analysis.score}%</Text>
                </View>
                <View style={s.scoreRight}>
                  <Text style={s.comprehensionLabel}>COMPREHENSION SCORE</Text>
                  <View style={s.scoreMiniStats}>
                    <View style={s.scoreMiniItem}>
                      <Text style={s.scoreMiniVal}>{analysis.difficulty}</Text>
                      <Text style={s.scoreMiniLabel}>Level</Text>
                    </View>
                    <View style={s.scoreMiniItem}>
                      <Text style={s.scoreMiniVal}>{article.meta?.split('•')[1]?.trim()}</Text>
                      <Text style={s.scoreMiniLabel}>Time</Text>
                    </View>
                  </View>
                </View>
              </View>
              <View style={s.scoreBg}>
                <Animated.View style={[s.scoreFill, {
                  width: scoreAnim.interpolate({ inputRange: [0, 100], outputRange: ['0%', '100%'] }),
                  backgroundColor: analysis.score >= 75 ? C.correct : analysis.score >= 50 ? C.gold : C.wrong,
                }]} />
              </View>
            </View>

            {/* ── CENTRAL IDEA ── */}
            <SectionCard>
              <CardTitle icon="💡" title="The Central Idea" />
              <View style={s.centralIdeaBox}>
                <View style={s.centralIdeaAccent} />
                <Text style={s.centralIdeaText}>{analysis.central_idea}</Text>
              </View>
            </SectionCard>

            {/* ── TONE ── */}
            {analysis.tone && (
              <SectionCard>
                <CardTitle icon="🎭" title="Author's Tone" />
                <View style={s.tonePillRow}>
                  {[analysis.tone.main, ...(analysis.tone.options ?? [])].map((t, i) => {
                    const isActive = t === activeTone;
                    return (
                      <TouchableOpacity key={i} onPress={() => setActiveTone(t)}
                        style={[s.tonePill, isActive && s.tonePillActive]} activeOpacity={0.75}>
                        <Text style={[s.tonePillText, isActive && s.tonePillTextActive]}>{t}</Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
                <View style={s.toneExplanationBox}>
                  <View style={s.toneExplRow}>
                    <Text style={s.toneExplIcon}>💬</Text>
                    <Text style={s.toneExplTitle}>
                      Why <Text style={{ color: C.primary }}>{activeTone ?? analysis.tone.main}</Text>?
                    </Text>
                  </View>
                  <Text style={s.toneExplText}>{analysis.tone.explanation}</Text>
                </View>
              </SectionCard>
            )}

            {/* ── LOGICAL STRUCTURE ── */}
            {(analysis.structure ?? []).length > 0 && (
              <SectionCard>
                <View style={s.cardTitleRowBetween}>
                  <CardTitle icon="🏗️" title="Logical Structure" />
                  <View style={[s.levelBadge, { backgroundColor: lvlCfg.bg }]}>
                    <Text style={[s.levelBadgeText, { color: lvlCfg.color }]}>{analysis.difficulty}</Text>
                  </View>
                </View>
                <View style={s.structureList}>
                  {analysis.structure.map((item, i) => (
                    <View key={i} style={s.structureItem}>
                      <View style={s.structureStep}>
                        <Text style={s.structureStepNum}>{i + 1}</Text>
                      </View>
                      {i < analysis.structure.length - 1 && <View style={s.structureLine} />}
                      <View style={s.structureContent}>
                        <Text style={s.structureHeading}>{item.heading}</Text>
                        <Text style={s.structureText}>{item.text}</Text>
                      </View>
                    </View>
                  ))}
                </View>
              </SectionCard>
            )}

            {/* ── ARGUMENTS ── */}
            {(analysis.arguments ?? []).length > 0 && (
              <SectionCard>
                <CardTitle icon="⚖️" title="Arguments & Evidence" />
                <View style={s.argList}>
                  {analysis.arguments.map((arg, i) => (
                    <View key={i} style={s.argBlock}>
                      <View style={s.claimRow}>
                        <View style={s.claimDot} />
                        <Text style={s.claimText}>{arg.claim}</Text>
                      </View>
                      {arg.evidence && (
                        <View style={s.evidenceBox}>
                          <Text style={s.evidenceQuote}>"</Text>
                          <Text style={s.evidenceText}>{arg.evidence}</Text>
                        </View>
                      )}
                    </View>
                  ))}
                </View>
              </SectionCard>
            )}

            {/* ── CAT TIP ── */}
            {analysis.cat_tip && (
              <View style={s.tipCard}>
                <View style={s.tipHeader}>
                  <View style={s.tipIconWrap}><Text style={s.tipIcon}>🎯</Text></View>
                  <View>
                    <Text style={s.tipEyebrow}>EXAM STRATEGY</Text>
                    <Text style={s.tipTitle}>CAT Tip</Text>
                  </View>
                </View>
                <Text style={s.tipText}>{analysis.cat_tip}</Text>
              </View>
            )}

            {/* ── BOTTOM CTA ── */}
            <TouchableOpacity style={s.ctaBtn} activeOpacity={0.88}
              onPress={() => navigation.navigate('RCDaily')}>
              <View>
                <Text style={s.ctaEyebrow}>READY TO TEST?</Text>
                <Text style={s.ctaTitle}>Practice RC Questions →</Text>
              </View>
              <View style={s.ctaIconWrap}><Text style={s.ctaIconText}>📝</Text></View>
            </TouchableOpacity>
          </>
        )}
        <View style={{ height: sc(32) }} />
      </ScrollView>
    </SafeAreaView>
  );
};

export default ArticleAnalyzeScreen;

// ─── STYLES ──────────────────────────────────────────────────────────────────
const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: C.bg },
  navbar: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: sc(16), paddingVertical: sc(10), backgroundColor: C.bg },
  navBtn: { width: sc(38), height: sc(38), borderRadius: sc(12), backgroundColor: C.surface, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: C.border, elevation: 2 },
  navBackIcon: { fontSize: sc(24), color: C.text, lineHeight: sc(28), marginTop: -sc(1) },
  navCenter: { alignItems: 'center' },
  navEyebrow: { fontSize: sc(10), fontWeight: '700', color: C.primary, letterSpacing: 1.2 },
  navSub: { fontSize: sc(11), fontWeight: '500', color: C.muted, marginTop: sc(1) },
  navDiffBadge: { paddingHorizontal: sc(10), paddingVertical: sc(6), borderRadius: sc(10) },
  navDiffText: { fontSize: sc(11), fontWeight: '800' },
  scroll: { paddingBottom: sc(48) },
  stickyHeader: { backgroundColor: C.bg, paddingHorizontal: sc(16), paddingTop: sc(4), paddingBottom: sc(14) },
  articleTitle: { fontSize: sc(18), fontWeight: '800', color: C.text, lineHeight: sc(25), letterSpacing: -0.3, marginBottom: sc(12) },
  scoreRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: sc(10) },
  scoreLeft: {},
  scoreReadLabel: { fontSize: sc(11), fontWeight: '700', color: C.primaryMid, marginBottom: sc(2) },
  scoreValue: { fontSize: sc(36), fontWeight: '900', color: C.primary, letterSpacing: -1 },
  scoreRight: { alignItems: 'flex-end' },
  comprehensionLabel: { fontSize: sc(9), fontWeight: '700', color: C.muted, letterSpacing: 0.8, marginBottom: sc(8) },
  scoreMiniStats: { flexDirection: 'row', gap: sc(12) },
  scoreMiniItem: { alignItems: 'center' },
  scoreMiniVal: { fontSize: sc(13), fontWeight: '800', color: C.text },
  scoreMiniLabel: { fontSize: sc(9), fontWeight: '600', color: C.muted, marginTop: sc(2) },
  scoreBg: { height: sc(7), backgroundColor: C.border, borderRadius: sc(4), overflow: 'hidden' },
  scoreFill: { height: '100%', borderRadius: sc(4) },
  card: { backgroundColor: C.surface, marginHorizontal: sc(16), marginTop: sc(14), padding: sc(18), borderRadius: sc(20), borderWidth: 1, borderColor: C.border, elevation: 2 },
  cardTitleRow: { flexDirection: 'row', alignItems: 'center', gap: sc(9), marginBottom: sc(14) },
  cardTitleRowBetween: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: sc(14) },
  cardTitleIconWrap: { width: sc(30), height: sc(30), borderRadius: sc(9), backgroundColor: C.primaryLight, alignItems: 'center', justifyContent: 'center' },
  cardTitleIcon: { fontSize: sc(14) },
  cardTitleText: { fontSize: sc(16), fontWeight: '800', color: C.text, letterSpacing: -0.2 },
  centralIdeaBox: { flexDirection: 'row', gap: sc(12), backgroundColor: C.primarySoft, borderRadius: sc(14), padding: sc(14), borderWidth: 1, borderColor: C.primaryLight },
  centralIdeaAccent: { width: sc(3), borderRadius: sc(2), backgroundColor: C.primaryMid, alignSelf: 'stretch' },
  centralIdeaText: { flex: 1, fontSize: sc(14), lineHeight: sc(22), fontStyle: 'italic', color: C.text, fontWeight: '500' },
  tonePillRow: { flexDirection: 'row', flexWrap: 'wrap', gap: sc(8), marginBottom: sc(14) },
  tonePill: { paddingHorizontal: sc(14), paddingVertical: sc(7), borderRadius: sc(20), backgroundColor: C.bg, borderWidth: 1, borderColor: C.border },
  tonePillActive: { backgroundColor: C.primary, borderColor: 'transparent' },
  tonePillText: { fontSize: sc(12), fontWeight: '600', color: C.sub },
  tonePillTextActive: { color: '#fff', fontWeight: '700' },
  toneExplanationBox: { backgroundColor: C.primarySoft, borderRadius: sc(14), padding: sc(14), borderWidth: 1, borderColor: C.primaryLight },
  toneExplRow: { flexDirection: 'row', alignItems: 'center', gap: sc(6), marginBottom: sc(6) },
  toneExplIcon: { fontSize: sc(14) },
  toneExplTitle: { fontSize: sc(13), fontWeight: '800', color: C.text },
  toneExplText: { fontSize: sc(13), lineHeight: sc(21), color: C.sub, fontWeight: '500' },
  levelBadge: { paddingHorizontal: sc(10), paddingVertical: sc(5), borderRadius: sc(9) },
  levelBadgeText: { fontSize: sc(11), fontWeight: '800' },
  structureList: { gap: sc(4) },
  structureItem: { flexDirection: 'row', gap: sc(12), minHeight: sc(52) },
  structureStep: { width: sc(26), height: sc(26), borderRadius: sc(8), backgroundColor: C.primary, alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: sc(2) },
  structureStepNum: { fontSize: sc(11), fontWeight: '800', color: '#fff' },
  structureLine: { position: 'absolute', left: sc(12), top: sc(30), width: sc(2), height: sc(28), backgroundColor: C.border },
  structureContent: { flex: 1, paddingBottom: sc(14) },
  structureHeading: { fontSize: sc(13), fontWeight: '800', color: C.text, marginBottom: sc(4) },
  structureText: { fontSize: sc(13), lineHeight: sc(20), color: C.sub, fontWeight: '500' },
  argList: { gap: sc(14) },
  argBlock: { gap: sc(8) },
  claimRow: { flexDirection: 'row', alignItems: 'flex-start', gap: sc(10) },
  claimDot: { width: sc(8), height: sc(8), borderRadius: sc(4), backgroundColor: C.primaryMid, marginTop: sc(5), flexShrink: 0 },
  claimText: { flex: 1, fontSize: sc(13), fontWeight: '700', color: C.text, lineHeight: sc(20) },
  evidenceBox: { backgroundColor: C.bg, borderRadius: sc(12), padding: sc(12), marginLeft: sc(18), borderLeftWidth: sc(3), borderLeftColor: C.border, flexDirection: 'row', gap: sc(6) },
  evidenceQuote: { fontSize: sc(22), color: C.muted, lineHeight: sc(22), marginTop: -sc(4) },
  evidenceText: { flex: 1, fontSize: sc(12), lineHeight: sc(19), fontStyle: 'italic', color: C.sub, fontWeight: '500' },
  tipCard: { backgroundColor: C.goldSoft, marginHorizontal: sc(16), marginTop: sc(14), padding: sc(18), borderRadius: sc(20), borderWidth: 1, borderColor: '#FDE68A' },
  tipHeader: { flexDirection: 'row', alignItems: 'center', gap: sc(10), marginBottom: sc(12) },
  tipIconWrap: { width: sc(36), height: sc(36), borderRadius: sc(11), backgroundColor: 'rgba(217,119,6,0.15)', alignItems: 'center', justifyContent: 'center' },
  tipIcon: { fontSize: sc(17) },
  tipEyebrow: { fontSize: sc(9), fontWeight: '700', color: C.gold, letterSpacing: 1 },
  tipTitle: { fontSize: sc(15), fontWeight: '800', color: '#92400E' },
  tipText: { fontSize: sc(13), lineHeight: sc(21), color: '#92400E', fontWeight: '500' },
  ctaBtn: { backgroundColor: C.primary, marginHorizontal: sc(16), marginTop: sc(14), padding: sc(18), borderRadius: sc(18), flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', elevation: 8 },
  ctaEyebrow: { fontSize: sc(9), fontWeight: '700', color: '#7BA882', letterSpacing: 1.2, marginBottom: sc(4) },
  ctaTitle: { fontSize: sc(16), fontWeight: '800', color: '#fff', letterSpacing: -0.2 },
  ctaIconWrap: { width: sc(44), height: sc(44), borderRadius: sc(13), backgroundColor: 'rgba(255,255,255,0.15)', alignItems: 'center', justifyContent: 'center' },
  ctaIconText: { fontSize: sc(22) },
  errorWrap: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: sc(32), gap: sc(10) },
  errorEmoji: { fontSize: sc(42) },
  errorTitle: { fontSize: sc(18), fontWeight: '800', color: C.text },
  errorSub: { fontSize: sc(13), color: C.muted, textAlign: 'center', lineHeight: sc(20) },
  errorBtn: { marginTop: sc(8), backgroundColor: C.primary, paddingHorizontal: sc(24), paddingVertical: sc(12), borderRadius: sc(12) },
  errorBtnText: { fontSize: sc(14), fontWeight: '800', color: '#fff' },
});