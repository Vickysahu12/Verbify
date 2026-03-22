import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  StatusBar, Animated, Dimensions, ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import axios from 'axios';
import { AuthService } from '../../../services/AuthService';

const { width: SW } = Dimensions.get('window');
const sc = n => (SW / 390) * n;

const api = axios.create({
  baseURL: 'http://10.182.41.220:8000',
  headers: { 'Content-Type': 'application/json' },
  timeout: 10000,
});

const C = {
  primary:      '#1F3B1F', primaryLight: '#E8F5EE',
  primaryMid:   '#2EA86B', primarySoft:  '#F0FAF5',
  surface:      '#FFFFFF', bg:           '#F6F8F7',
  border:       '#E8EDEA', borderLight:  '#F0F4F2',
  text:         '#0D1F15', sub:          '#527A62',
  muted:        '#9DB5A5', correct:      '#16A34A',
  correctBg:    '#DCFCE7', wrong:        '#DC2626',
  gold:         '#D97706', goldSoft:     '#FEF3C7',
  blue:         '#2563EB', blueSoft:     '#EFF6FF',
  shadow:       '#0D1F15',
};

const STRATEGIES = [
  {
    title: 'Identifying Opening Sentences', icon: '🔍',
    content: "Look for broad contextual statements that introduce a topic fresh. Avoid sentences starting with pronouns like 'it', 'they', 'this' — these always refer back to something already stated.",
    tip: "If a sentence can stand alone without any context, it's likely the opener.",
  },
  {
    title: 'Connecting Transition Words', icon: '🔗',
    content: "Track linking words like 'However', 'Therefore', 'Moreover', 'Furthermore'. These words create mandatory sequence — 'However' means contrast from the previous sentence.",
    tip: 'Transition words are like arrows pointing to their previous sentence.',
  },
  {
    title: 'Pronoun–Noun Linking', icon: '⛓️',
    content: "Whenever a pronoun (it, they, such, this) appears, find the noun it refers to. That noun sentence must come immediately before the pronoun sentence.",
    tip: "'Such' is the strongest signal — it almost always directly follows its defining noun.",
  },
];

// ─── Skeleton ────────────────────────────────────────────────────────────────
const SkeletonPulse = ({ style }) => {
  const anim = useRef(new Animated.Value(0.4)).current;
  useEffect(() => {
    Animated.loop(Animated.sequence([
      Animated.timing(anim, { toValue: 1,   duration: 750, useNativeDriver: true }),
      Animated.timing(anim, { toValue: 0.4, duration: 750, useNativeDriver: true }),
    ])).start();
  }, []);
  return <Animated.View style={[{ backgroundColor: C.border, opacity: anim }, style]} />;
};

const HubSkeleton = () => (
  <View style={{ padding: sc(16), gap: sc(12) }}>
    <SkeletonPulse style={{ height: sc(100), borderRadius: sc(20) }} />
    <SkeletonPulse style={{ height: sc(150), borderRadius: sc(20) }} />
    {[0,1,2].map(i => <SkeletonPulse key={i} style={{ height: sc(95), borderRadius: sc(16) }} />)}
  </View>
);

// ─── Module Card ─────────────────────────────────────────────────────────────
const ModuleCard = React.memo(({ mod, navigation }) => {
  const pressScale   = useRef(new Animated.Value(1)).current;
  const progressAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(progressAnim, {
      toValue: mod.progress, duration: 900, delay: 300, useNativeDriver: false,
    }).start();
  }, [mod.progress]);

  const onPressIn  = () => Animated.spring(pressScale, { toValue: 0.97, useNativeDriver: true, speed: 60 }).start();
  const onPressOut = () => Animated.spring(pressScale, { toValue: 1,    useNativeDriver: true, speed: 60 }).start();

  const accentColor = mod.progress >= 80 ? C.correct : mod.progress >= 40 ? C.gold : C.blue;
  const tagBg    = mod.tag?.bg    ?? C.blueSoft;
  const tagColor = mod.tag?.color ?? C.blue;

  const practiceRouteMap = {
    'para_jumble':  'ParaJumblePractice',
    'odd_one_out':  'OddOneOutPractice',
    'para_summary': 'ParaSummaryPractice',
  };
  const practiceRoute = practiceRouteMap[mod.id] ?? mod.route;

  return (
    <Animated.View style={{ transform: [{ scale: pressScale }] }}>
      <View style={s.moduleCard}>
        <View style={[s.moduleAccent, { backgroundColor: accentColor }]} />
        <View style={s.moduleInner}>
          <View style={s.moduleTop}>
            <View style={[s.moduleIconWrap, { backgroundColor: C.primaryLight }]}>
              <Text style={s.moduleIcon}>{mod.icon}</Text>
            </View>
            <View style={s.moduleTitleBlock}>
              <Text style={s.moduleTitle}>{mod.title}</Text>
              <Text style={s.moduleSubtitle}>{mod.subtitle}</Text>
            </View>
            <View style={[s.moduleTag, { backgroundColor: tagBg }]}>
              <Text style={[s.moduleTagText, { color: tagColor }]}>{mod.tag?.label ?? 'NEW'}</Text>
            </View>
          </View>
          <View style={s.progressRow}>
            <View style={s.progressTrack}>
              <Animated.View style={[s.progressFill, {
                width: progressAnim.interpolate({ inputRange: [0, 100], outputRange: ['0%', '100%'] }),
                backgroundColor: accentColor,
              }]} />
            </View>
            <Text style={[s.progressPct, { color: accentColor }]}>{mod.progress}%</Text>
          </View>
          {/* Learn + Practice buttons */}
          <View style={s.moduleBtnRow}>
            <TouchableOpacity
              style={[s.moduleBtn, s.moduleBtnOutline]}
              onPress={() => navigation.navigate(mod.route)}
              activeOpacity={0.8}>
              <Text style={s.moduleBtnOutlineText}>📖 Learn</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[s.moduleBtn, { backgroundColor: accentColor, borderRadius: sc(10), alignItems: 'center', justifyContent: 'center' }]}
              onPress={() => navigation.navigate(practiceRoute)}
              activeOpacity={0.8}>
              <Text style={s.moduleBtnFillText}>✏️ Practice</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Animated.View>
  );
});


// ─── Accordion ───────────────────────────────────────────────────────────────
const AccordionCard = React.memo(({ item, isOpen, onToggle }) => {
  const heightAnim = useRef(new Animated.Value(0)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const [measured, setMeasured] = useState(false);
  const [bodyH,    setBodyH]    = useState(0);

  useEffect(() => {
    Animated.parallel([
      Animated.timing(heightAnim, { toValue: isOpen ? bodyH : 0, duration: 240, useNativeDriver: false }),
      Animated.timing(rotateAnim, { toValue: isOpen ? 1 : 0,     duration: 220, useNativeDriver: true  }),
    ]).start();
  }, [isOpen, bodyH]);

  const rotate = rotateAnim.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '180deg'] });

  return (
    <TouchableOpacity activeOpacity={0.92}
      style={[s.accordionCard, isOpen && s.accordionCardOpen]}
      onPress={onToggle}>
      <View style={s.accordionHeader}>
        <View style={[s.accordionIconWrap, isOpen && { backgroundColor: C.primaryLight }]}>
          <Text style={s.accordionIcon}>{item.icon}</Text>
        </View>
        <Text style={[s.accordionTitle, isOpen && { color: C.primary }]}>{item.title}</Text>
        <Animated.View style={[s.chevronWrap, isOpen && s.chevronWrapOpen, { transform: [{ rotate }] }]}>
          <Text style={[s.chevron, isOpen && { color: '#fff' }]}>⌄</Text>
        </Animated.View>
      </View>
      <Animated.View style={{ overflow: 'hidden', height: measured ? heightAnim : undefined }}>
        <View onLayout={e => { if (!measured) { setBodyH(e.nativeEvent.layout.height); setMeasured(true); } }}
          style={s.accordionBody}>
          <Text style={s.accordionText}>{item.content}</Text>
          {item.tip && (
            <View style={s.tipBox}>
              <Text style={s.tipIcon}>💡</Text>
              <Text style={s.tipText}>{item.tip}</Text>
            </View>
          )}
        </View>
      </Animated.View>
    </TouchableOpacity>
  );
});

// ─── Main Screen ─────────────────────────────────────────────────────────────
const VAHubScreen = () => {
  const navigation = useNavigation();
  const [hubData,   setHubData]   = useState(null);
  const [loading,   setLoading]   = useState(true);
  const [openIndex, setOpenIndex] = useState(null);
  const backScale = useRef(new Animated.Value(1)).current;

  useFocusEffect(useCallback(() => { loadHub(); }, []));

  const loadHub = async () => {
    try {
      setLoading(true);
      const token = await AuthService.getToken();
      const res   = await api.get('/va/hub', { headers: { Authorization: `Bearer ${token}` } });
      setHubData(res.data);
    } catch (err) {
      console.log('VAHub error:', err);
      setHubData(null);
    } finally {
      setLoading(false);
    }
  };

  const toggle = useCallback(i => setOpenIndex(prev => prev === i ? null : i), []);

  const handleBack = useCallback(() => {
    Animated.sequence([
      Animated.timing(backScale, { toValue: 0.85, duration: 70, useNativeDriver: true }),
      Animated.timing(backScale, { toValue: 1,    duration: 70, useNativeDriver: true }),
    ]).start(() => navigation.goBack());
  }, [navigation]);

  const userName      = hubData?.user_name      ?? '—';
  const streak        = hubData?.streak         ?? 0;
  const totalProgress = hubData?.total_progress ?? 0;
  const modules       = hubData?.modules        ?? [];

  return (
    <SafeAreaView style={s.safe} edges={['top']}>
      <StatusBar barStyle="dark-content" backgroundColor={C.bg} />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={s.scroll} stickyHeaderIndices={[0]}>

        {/* Sticky Navbar */}
        <View style={s.navbar}>
          <Animated.View style={{ transform: [{ scale: backScale }] }}>
            <TouchableOpacity onPress={handleBack} style={s.navBtn}
              hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}>
              <Text style={s.navBackIcon}>‹</Text>
            </TouchableOpacity>
          </Animated.View>
          <View style={s.navCenter} pointerEvents="none">
            <Text style={s.navTitle}>VA Concept Hub</Text>
            <Text style={s.navSub}>PREMIUM CAT ACCESS</Text>
          </View>
          <View style={{ width: sc(36) }} />
        </View>

        {loading ? <HubSkeleton /> : (
          <>
            {/* Progress Banner */}
            <View style={s.progressBanner}>
              <View style={s.bannerLeft}>
                <Text style={s.bannerGreeting}>Good Morning, {userName} 👋</Text>
                <Text style={s.bannerSub}>Keep going — you're making great strides!</Text>
                <View style={s.bannerBarRow}>
                  <View style={s.bannerBarBg}>
                    <View style={[s.bannerBarFill, { width: `${totalProgress}%` }]} />
                  </View>
                  <Text style={s.bannerBarPct}>{totalProgress}%</Text>
                </View>
                <Text style={s.bannerBarLabel}>Overall mastery</Text>
              </View>
              <View style={s.bannerRight}>
                <Text style={s.bannerStreakNum}>{streak}</Text>
                <Text style={s.bannerStreakLabel}>🔥 days</Text>
              </View>
            </View>

            {/* Today's Challenge */}
            <View style={s.challengeCard}>
              <View style={s.deco1} /><View style={s.deco2} />
              <View style={s.challengeTopRow}>
                <View style={s.challengeLabelRow}>
                  <View style={s.challengeDot} />
                  <Text style={s.challengeEyebrow}>TODAY'S CHALLENGE</Text>
                </View>
                <View style={s.xpBadge}><Text style={s.xpText}>+50 XP</Text></View>
              </View>
              <Text style={s.challengeTitle}>Daily VA Challenge</Text>
              <Text style={s.challengeDesc}>
                Solve today's Parajumble to maintain your {streak}-day streak and earn bonus XP!
              </Text>
              <View style={s.challengeMetaRow}>
                {['⏱ ~5 min', '📊 Medium', '🔀 Parajumble'].map((chip, i) => (
                  <View key={i} style={s.metaChip}><Text style={s.metaChipText}>{chip}</Text></View>
                ))}
              </View>
              <TouchableOpacity style={s.challengeBtn} activeOpacity={0.88}
                onPress={() => navigation.navigate('Parajumble')}>
                <Text style={s.challengeBtnText}>Start Challenge  →</Text>
              </TouchableOpacity>
            </View>

            {/* Mastery Modules — dynamic from backend */}
            <View style={s.section}>
              <View style={s.sectionRow}>
                <View style={s.sectionLeft}>
                  <View style={s.sectionBar} />
                  <Text style={s.sectionTitle}>Mastery Modules</Text>
                </View>
              </View>
              <View style={{ gap: sc(10) }}>
                {modules.map(mod => (
                  <ModuleCard key={mod.id} mod={mod} navigation={navigation} />
                ))}
              </View>
            </View>

            {/* Core Strategies — static educational content */}
            <View style={s.section}>
              <View style={s.sectionRow}>
                <View style={s.sectionLeft}>
                  <View style={s.sectionBar} />
                  <Text style={s.sectionTitle}>Core Strategies</Text>
                </View>
              </View>
              <View style={{ gap: sc(10) }}>
                {STRATEGIES.map((strategy, i) => (
                  <AccordionCard key={i} item={strategy} isOpen={openIndex === i} onToggle={() => toggle(i)} />
                ))}
              </View>
            </View>

            {/* CAT Tip */}
            <View style={s.tipBanner}>
              <View style={[s.tipBannerIconWrap, { backgroundColor: C.goldSoft }]}>
                <Text style={s.tipBannerIcon}>💡</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={s.tipBannerEyebrow}>CAT STRATEGY TIP</Text>
                <Text style={s.tipBannerText}>
                  In Parajumbles, always find the mandatory first sentence — it sets the context and makes everything else fall in place.
                </Text>
              </View>
            </View>
          </>
        )}
        <View style={{ height: sc(40) }} />
      </ScrollView>
    </SafeAreaView>
  );
};

export default VAHubScreen;

const s = StyleSheet.create({
  safe:    { flex: 1, backgroundColor: C.bg },
  scroll:  { paddingBottom: sc(16) },
  section: { paddingHorizontal: sc(16), marginBottom: sc(18) },
  navbar: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: sc(16), paddingTop: sc(10), paddingBottom: sc(10), backgroundColor: C.bg, borderBottomWidth: 1, borderBottomColor: C.borderLight },
  navBtn: { width: sc(36), height: sc(36), borderRadius: sc(11), backgroundColor: C.surface, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: C.border, elevation: 2 },
  navBackIcon: { fontSize: sc(22), color: C.text, lineHeight: sc(26), marginTop: -sc(1) },
  navCenter: { position: 'absolute', left: 0, right: 0, alignItems: 'center', justifyContent: 'center' },
  navTitle: { fontSize: sc(15), fontWeight: '800', color: C.text, letterSpacing: -0.3 },
  navSub: { fontSize: sc(9), fontWeight: '700', color: C.gold, letterSpacing: 1.1, marginTop: sc(1) },
  progressBanner: { flexDirection: 'row', backgroundColor: C.primary, marginHorizontal: sc(16), borderRadius: sc(20), padding: sc(16), marginTop: sc(12), marginBottom: sc(12), alignItems: 'center', overflow: 'hidden', elevation: 7 },
  bannerLeft: { flex: 1 },
  bannerGreeting: { fontSize: sc(15), fontWeight: '800', color: '#fff', marginBottom: sc(2) },
  bannerSub: { fontSize: sc(11), color: 'rgba(255,255,255,0.6)', marginBottom: sc(10), lineHeight: sc(16), fontWeight: '500' },
  bannerBarRow: { flexDirection: 'row', alignItems: 'center', gap: sc(8), marginBottom: sc(4) },
  bannerBarBg: { flex: 1, height: sc(5), backgroundColor: 'rgba(255,255,255,0.15)', borderRadius: sc(3), overflow: 'hidden' },
  bannerBarFill: { height: '100%', backgroundColor: C.primaryMid, borderRadius: sc(3) },
  bannerBarPct: { fontSize: sc(11), fontWeight: '800', color: '#fff', width: sc(30), textAlign: 'right' },
  bannerBarLabel: { fontSize: sc(10), color: 'rgba(255,255,255,0.5)', fontWeight: '600' },
  bannerRight: { alignItems: 'center', marginLeft: sc(12), backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: sc(13), paddingHorizontal: sc(12), paddingVertical: sc(10) },
  bannerStreakNum: { fontSize: sc(26), fontWeight: '900', color: '#FFD700', lineHeight: sc(30) },
  bannerStreakLabel: { fontSize: sc(10), color: 'rgba(255,255,255,0.6)', fontWeight: '600', marginTop: sc(2) },
  challengeCard: { backgroundColor: C.primary, marginHorizontal: sc(16), borderRadius: sc(20), padding: sc(18), marginBottom: sc(20), overflow: 'hidden', position: 'relative', elevation: 9 },
  deco1: { position: 'absolute', width: sc(120), height: sc(120), borderRadius: sc(60), backgroundColor: 'rgba(255,255,255,0.04)', top: -sc(35), right: -sc(25) },
  deco2: { position: 'absolute', width: sc(65),  height: sc(65),  borderRadius: sc(33), backgroundColor: 'rgba(46,168,107,0.15)',  bottom: -sc(18), right: sc(48) },
  challengeTopRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: sc(8) },
  challengeLabelRow: { flexDirection: 'row', alignItems: 'center', gap: sc(6) },
  challengeDot: { width: sc(6), height: sc(6), borderRadius: sc(3), backgroundColor: C.primaryMid },
  challengeEyebrow: { fontSize: sc(9), fontWeight: '800', color: '#7BA882', letterSpacing: 1.2 },
  xpBadge: { backgroundColor: 'rgba(255,215,0,0.15)', borderRadius: sc(20), paddingHorizontal: sc(10), paddingVertical: sc(4), borderWidth: 1, borderColor: 'rgba(255,215,0,0.3)' },
  xpText: { fontSize: sc(11), fontWeight: '800', color: '#FFD700' },
  challengeTitle: { fontSize: sc(20), fontWeight: '900', color: '#fff', marginBottom: sc(5), letterSpacing: -0.3 },
  challengeDesc: { fontSize: sc(12), color: 'rgba(255,255,255,0.65)', lineHeight: sc(19), marginBottom: sc(14), fontWeight: '500' },
  challengeMetaRow: { flexDirection: 'row', gap: sc(7), marginBottom: sc(16), flexWrap: 'wrap' },
  metaChip: { backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: sc(20), paddingHorizontal: sc(10), paddingVertical: sc(5) },
  metaChipText: { fontSize: sc(11), color: 'rgba(255,255,255,0.75)', fontWeight: '600' },
  challengeBtn: { backgroundColor: '#fff', paddingVertical: sc(13), borderRadius: sc(13), alignItems: 'center' },
  challengeBtnText: { color: C.primary, fontWeight: '800', fontSize: sc(13), letterSpacing: -0.2 },
  sectionRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: sc(10) },
  sectionLeft: { flexDirection: 'row', alignItems: 'center', gap: sc(8) },
  sectionBar: { width: sc(4), height: sc(17), borderRadius: sc(2), backgroundColor: C.primaryMid },
  sectionTitle: { fontSize: sc(15), fontWeight: '800', color: C.text, letterSpacing: -0.3 },
  moduleCard: { flexDirection: 'row', backgroundColor: C.surface, borderRadius: sc(16), borderWidth: 1, borderColor: C.border, overflow: 'hidden', elevation: 2 },
  moduleAccent: { width: sc(4) },
  moduleInner: { flex: 1, padding: sc(13) },
  moduleTop: { flexDirection: 'row', alignItems: 'center', gap: sc(10), marginBottom: sc(10) },
  moduleIconWrap: { width: sc(40), height: sc(40), borderRadius: sc(12), alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  moduleIcon: { fontSize: sc(19) },
  moduleTitleBlock: { flex: 1 },
  moduleTitle: { fontSize: sc(13), fontWeight: '800', color: C.text, marginBottom: sc(2) },
  moduleSubtitle: { fontSize: sc(11), fontWeight: '500', color: C.muted },
  moduleTag: { paddingHorizontal: sc(7), paddingVertical: sc(3), borderRadius: sc(7) },
  moduleTagText: { fontSize: sc(9), fontWeight: '800', letterSpacing: 0.3 },
  progressRow: { flexDirection: 'row', alignItems: 'center', gap: sc(8), marginBottom: sc(10) },
  progressTrack: { flex: 1, height: sc(5), backgroundColor: C.bg, borderRadius: sc(3), overflow: 'hidden' },
  progressFill: { height: '100%', borderRadius: sc(3) },
  progressPct: { fontSize: sc(11), fontWeight: '800', width: sc(32), textAlign: 'right' },
  moduleBtnRow: { flexDirection: 'row', gap: sc(8), paddingTop: sc(10), borderTopWidth: 1, borderTopColor: C.borderLight },
  moduleBtn: { flex: 1, paddingVertical: sc(10), borderRadius: sc(10), alignItems: 'center', justifyContent: 'center' },
  moduleBtnOutline: { borderWidth: 1.5, borderColor: C.border, backgroundColor: C.bg },
  moduleBtnOutlineText: { fontSize: sc(13), fontWeight: '700', color: C.primary },
  moduleBtnFillText: { fontSize: sc(13), fontWeight: '800', color: '#fff' },
  moduleCTA: { fontSize: sc(12), fontWeight: '700', color: C.primary },
  moduleArrowWrap: { width: sc(24), height: sc(24), borderRadius: sc(7), backgroundColor: C.primaryLight, alignItems: 'center', justifyContent: 'center' },
  moduleArrow: { fontSize: sc(12), fontWeight: '800', color: C.primary },
  accordionCard: { backgroundColor: C.surface, borderRadius: sc(16), padding: sc(13), borderWidth: 1, borderColor: C.border, elevation: 2 },
  accordionCardOpen: { borderColor: C.primary, borderWidth: 1.5 },
  accordionHeader: { flexDirection: 'row', alignItems: 'center', gap: sc(10) },
  accordionIconWrap: { width: sc(34), height: sc(34), borderRadius: sc(10), backgroundColor: C.bg, alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  accordionIcon: { fontSize: sc(15) },
  accordionTitle: { flex: 1, fontSize: sc(13), fontWeight: '700', color: C.text, lineHeight: sc(18) },
  chevronWrap: { width: sc(26), height: sc(26), borderRadius: sc(7), backgroundColor: C.bg, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: C.border },
  chevronWrapOpen: { backgroundColor: C.primary, borderColor: 'transparent' },
  chevron: { fontSize: sc(13), fontWeight: '700', color: C.sub },
  accordionBody: { paddingTop: sc(12), marginTop: sc(10), borderTopWidth: 1, borderTopColor: C.borderLight },
  accordionText: { fontSize: sc(13), lineHeight: sc(20), color: C.sub, fontWeight: '500', marginBottom: sc(10) },
  tipBox: { flexDirection: 'row', backgroundColor: C.primarySoft, borderRadius: sc(11), padding: sc(11), gap: sc(8), alignItems: 'flex-start', borderLeftWidth: sc(3), borderLeftColor: C.primaryMid },
  tipIcon: { fontSize: sc(12), marginTop: sc(1) },
  tipText: { flex: 1, fontSize: sc(12), color: C.primary, lineHeight: sc(18), fontWeight: '600', fontStyle: 'italic' },
  tipBanner: { backgroundColor: C.primarySoft, marginHorizontal: sc(16), borderRadius: sc(16), padding: sc(14), borderWidth: 1, borderColor: C.primaryLight, flexDirection: 'row', gap: sc(12), alignItems: 'flex-start' },
  tipBannerIconWrap: { width: sc(34), height: sc(34), borderRadius: sc(9), alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  tipBannerIcon: { fontSize: sc(17) },
  tipBannerEyebrow: { fontSize: sc(9), fontWeight: '800', color: C.primaryMid, letterSpacing: 1, marginBottom: sc(3) },
  tipBannerText: { fontSize: sc(12), lineHeight: sc(18), color: C.sub, fontWeight: '500' },
});