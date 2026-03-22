/**
 * ParaJumbleScreen.jsx — Learn Only
 * Sirf strategies + examples — koi practice questions nahi
 * Last card pe "Start Practice" button → ParaJumblePractice screen
 */

import React, { useState, useRef } from 'react';
import { PJ_LEARN_CARDS as LEARN_CARDS } from './dataa/ParaContent';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  Animated, Dimensions, StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width: SW } = Dimensions.get('window');
const sc = n => (SW / 390) * n;

const C = {
  accent: '#1a3c8f', accentLight: '#EEF2FF', accentMid: '#3B5FDB',
  bg: '#F7F8FC', surface: '#FFFFFF', border: '#E8EBF4', borderLight: '#F0F2FA',
  text: '#111827', sub: '#374151', muted: '#6B7594',
  correct: '#16a34a',
};

export default function ParaJumbleScreen({ navigation }) {
  const [activeLearnTab, setActiveLearnTab] = useState(0);
  const scrollRef = useRef(null);
  const backScale = useRef(new Animated.Value(1)).current;

  const currentCard   = LEARN_CARDS[activeLearnTab];
  const totalProgress = Math.round(((activeLearnTab + 1) / LEARN_CARDS.length) * 100);
  const isLastCard    = activeLearnTab === LEARN_CARDS.length - 1;

  const goToLearnTab = i => {
    setActiveLearnTab(i);
    scrollRef.current?.scrollTo({ y: 0, animated: true });
  };

  const handleBack = () => {
    Animated.sequence([
      Animated.timing(backScale, { toValue: 0.85, duration: 70, useNativeDriver: true }),
      Animated.timing(backScale, { toValue: 1,    duration: 70, useNativeDriver: true }),
    ]).start(() => navigation?.goBack());
  };

  return (
    <SafeAreaView style={s.safe} edges={['top']}>
      <StatusBar barStyle="dark-content" backgroundColor={C.bg} />

      <View style={s.navbar}>
        <Animated.View style={{ transform: [{ scale: backScale }], zIndex: 1 }}>
          <TouchableOpacity onPress={handleBack} style={s.navBtn}
            hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}>
            <Text style={s.navBackIcon}>‹</Text>
          </TouchableOpacity>
        </Animated.View>
        <View style={s.navCenter} pointerEvents="none">
          <Text style={s.navTitle}>Para Jumble — Learn</Text>
          <Text style={s.navSub}>VERBAL ABILITY PREP</Text>
        </View>
        <View style={s.navInfoBtn}><Text style={s.navInfoText}>ⓘ</Text></View>
      </View>

      <View style={s.progressTrack}>
        <View style={[s.progressFill, { width: `${totalProgress}%` }]} />
      </View>

      <View style={s.statsStrip}>
        {[
          { val: LEARN_CARDS.length,                        label: 'Strategies' },
          { val: `${activeLearnTab + 1}/${LEARN_CARDS.length}`, label: 'Current'    },
          { val: `${totalProgress}%`,                       label: 'Progress'   },
        ].map((st, i) => (
          <React.Fragment key={i}>
            {i > 0 && <View style={s.statDiv} />}
            <View style={s.statItem}>
              <Text style={s.statVal}>{st.val}</Text>
              <Text style={s.statLabel}>{st.label}</Text>
            </View>
          </React.Fragment>
        ))}
      </View>

      <ScrollView ref={scrollRef} style={s.scroll} contentContainerStyle={s.scrollContent}
        showsVerticalScrollIndicator={false}>

        <View style={s.sectionHeader}>
          <View style={s.sectionLeft}>
            <View style={s.sectionDot} />
            <Text style={s.sectionTitle}>LEARN THE STRATEGIES</Text>
          </View>
        </View>

        <View style={s.tabRow}>
          {LEARN_CARDS.map((card, i) => (
            <TouchableOpacity key={card.id} onPress={() => goToLearnTab(i)}
              style={[s.tabPill, activeLearnTab === i && { backgroundColor: card.accentColor }]}>
              <Text style={[s.tabPillText, activeLearnTab === i && { color: '#fff' }]}>
                {card.icon}  S0{card.id}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={[s.badge, { backgroundColor: currentCard.bgColor }]}>
          <Text style={[s.badgeText, { color: currentCard.accentColor }]}>{currentCard.badge}</Text>
        </View>

        <View style={[s.heroCard, { borderLeftColor: currentCard.accentColor }]}>
          <View style={s.heroTopRow}>
            <Text style={s.heroIcon}>{currentCard.icon}</Text>
            <Text style={[s.heroTitle, { color: currentCard.accentColor }]}>{currentCard.title}</Text>
          </View>
          <Text style={s.heroDesc}>{currentCard.description}</Text>
        </View>

        <Text style={s.subHeading}>Step-by-Step Approach</Text>
        {currentCard.steps.map((step, i) => (
          <View key={i} style={s.stepRow}>
            <View style={[s.stepNum, { backgroundColor: currentCard.accentColor }]}>
              <Text style={s.stepNumText}>{i + 1}</Text>
            </View>
            <Text style={s.stepText}>{step}</Text>
          </View>
        ))}

        <View style={[s.tipCard, { backgroundColor: currentCard.bgColor, borderColor: currentCard.accentColor }]}>
          <Text style={s.tipIcon}>💡</Text>
          <Text style={[s.tipText, { color: currentCard.accentColor }]}>{currentCard.tip}</Text>
        </View>

        <Text style={s.subHeading}>See It In Action</Text>
        {currentCard.example.sentences.map((sent, i) => (
          <View key={i} style={[s.exRow, sent.role && { borderColor: currentCard.accentColor, borderWidth: sc(2) }]}>
            <View style={[s.exLetter, { backgroundColor: sent.role ? currentCard.accentColor : '#C9D0E8' }]}>
              <Text style={s.exLetterText}>{sent.label}</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={s.exText}>{sent.text}</Text>
              {sent.role && (
                <View style={[s.roleBadge, { backgroundColor: currentCard.bgColor }]}>
                  <Text style={[s.roleBadgeText, { color: currentCard.accentColor }]}>
                    {sent.role === 'OPENER' ? '✓ OPENS THE PARAGRAPH' : `🔗 ${sent.role}`}
                  </Text>
                </View>
              )}
              {sent.note && <Text style={s.exNote}>{sent.note}</Text>}
            </View>
          </View>
        ))}

        <View style={[s.explanationBox, { borderLeftColor: currentCard.accentColor }]}>
          <Text style={s.explanationIcon}>📌</Text>
          <Text style={s.explanationText}>{currentCard.example.explanation}</Text>
        </View>

        {/* Nav buttons */}
        <View style={s.learnNavRow}>
          {activeLearnTab > 0 && (
            <TouchableOpacity style={[s.learnNavOutline, { borderColor: currentCard.accentColor }]}
              onPress={() => goToLearnTab(activeLearnTab - 1)}>
              <Text style={[s.learnNavOutlineText, { color: currentCard.accentColor }]}>← Prev</Text>
            </TouchableOpacity>
          )}
          {!isLastCard ? (
            <TouchableOpacity style={[s.learnNavFill, { backgroundColor: currentCard.accentColor }]}
              onPress={() => goToLearnTab(activeLearnTab + 1)}>
              <Text style={s.learnNavFillText}>Next Strategy →</Text>
            </TouchableOpacity>
          ) : (
            /* Last card pe Practice button */
            <TouchableOpacity style={[s.learnNavFill, { backgroundColor: C.correct }]}
              onPress={() => navigation.navigate('ParaJumblePractice')}>
              <Text style={s.learnNavFillText}>Start Practice ✏️</Text>
            </TouchableOpacity>
          )}
        </View>

        <View style={s.dotsRow}>
          {LEARN_CARDS.map((_, i) => (
            <View key={i} style={[s.dot,
              activeLearnTab === i && { backgroundColor: currentCard.accentColor, width: sc(22) }]} />
          ))}
        </View>

        <View style={{ height: sc(40) }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: C.bg },
  scroll: { flex: 1 },
  scrollContent: { paddingHorizontal: sc(16), paddingTop: sc(18), paddingBottom: sc(20) },
  navbar: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: sc(16), paddingTop: sc(10), paddingBottom: sc(10), backgroundColor: C.bg, borderBottomWidth: 1, borderBottomColor: C.borderLight },
  navBtn: { width: sc(36), height: sc(36), borderRadius: sc(11), backgroundColor: C.surface, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: C.border, elevation: 2 },
  navBackIcon: { fontSize: sc(22), color: C.text, lineHeight: sc(26), marginTop: -sc(1) },
  navCenter: { position: 'absolute', left: 0, right: 0, alignItems: 'center', justifyContent: 'center' },
  navTitle: { fontSize: sc(15), fontWeight: '800', color: C.accent, letterSpacing: -0.2 },
  navSub: { fontSize: sc(9), fontWeight: '700', color: C.muted, letterSpacing: 1.1, marginTop: sc(1) },
  navInfoBtn: { width: sc(36), height: sc(36), borderRadius: sc(11), backgroundColor: C.accent, alignItems: 'center', justifyContent: 'center', zIndex: 1 },
  navInfoText: { fontSize: sc(15), color: '#fff', fontWeight: '800' },
  progressTrack: { height: sc(3), backgroundColor: C.borderLight },
  progressFill: { height: sc(3), backgroundColor: C.accentMid, borderRadius: sc(2) },
  statsStrip: { flexDirection: 'row', backgroundColor: C.accent, paddingVertical: sc(10), paddingHorizontal: sc(16), alignItems: 'center', justifyContent: 'space-around' },
  statItem: { alignItems: 'center' },
  statVal: { fontSize: sc(14), fontWeight: '800', color: '#fff' },
  statLabel: { fontSize: sc(10), fontWeight: '600', color: 'rgba(255,255,255,0.5)', marginTop: sc(1) },
  statDiv: { width: 1, height: sc(24), backgroundColor: 'rgba(255,255,255,0.15)' },
  sectionHeader: { marginBottom: sc(12) },
  sectionLeft: { flexDirection: 'row', alignItems: 'center', gap: sc(8), marginBottom: sc(3) },
  sectionDot: { width: sc(8), height: sc(8), borderRadius: sc(4), backgroundColor: C.accent },
  sectionTitle: { fontSize: sc(11), fontWeight: '800', color: C.muted, letterSpacing: 1.4 },
  tabRow: { flexDirection: 'row', gap: sc(8), marginBottom: sc(12) },
  tabPill: { flex: 1, paddingVertical: sc(9), borderRadius: sc(22), backgroundColor: C.border, alignItems: 'center' },
  tabPillText: { fontSize: sc(12), fontWeight: '700', color: C.muted },
  badge: { alignSelf: 'flex-start', paddingHorizontal: sc(12), paddingVertical: sc(5), borderRadius: sc(20), marginBottom: sc(10) },
  badgeText: { fontSize: sc(11), fontWeight: '800', letterSpacing: 0.8 },
  heroCard: { backgroundColor: C.surface, borderRadius: sc(16), padding: sc(16), borderLeftWidth: sc(4), marginBottom: sc(16), elevation: 3 },
  heroTopRow: { flexDirection: 'row', alignItems: 'center', marginBottom: sc(8), gap: sc(10) },
  heroIcon: { fontSize: sc(24) },
  heroTitle: { fontSize: sc(17), fontWeight: '800', letterSpacing: 0.1, flex: 1 },
  heroDesc: { fontSize: sc(13), lineHeight: sc(21), color: C.sub },
  subHeading: { fontSize: sc(14), fontWeight: '800', color: C.text, marginBottom: sc(10), marginTop: sc(2) },
  stepRow: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: sc(9), gap: sc(11) },
  stepNum: { width: sc(26), height: sc(26), borderRadius: sc(13), alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: sc(1) },
  stepNumText: { fontSize: sc(12), fontWeight: '800', color: '#fff' },
  stepText: { flex: 1, fontSize: sc(13), lineHeight: sc(20), color: C.sub },
  tipCard: { flexDirection: 'row', gap: sc(8), borderRadius: sc(12), padding: sc(13), borderWidth: 1.5, marginBottom: sc(18), marginTop: sc(4), alignItems: 'flex-start' },
  tipIcon: { fontSize: sc(14), marginTop: sc(1) },
  tipText: { flex: 1, fontSize: sc(13), lineHeight: sc(20), fontWeight: '500' },
  exRow: { flexDirection: 'row', backgroundColor: C.surface, borderRadius: sc(12), padding: sc(12), marginBottom: sc(7), gap: sc(10), borderWidth: 1, borderColor: C.border },
  exLetter: { width: sc(26), height: sc(26), borderRadius: sc(7), alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  exLetterText: { fontSize: sc(12), fontWeight: '800', color: '#fff' },
  exText: { fontSize: sc(13), lineHeight: sc(20), color: C.sub, marginBottom: sc(4) },
  roleBadge: { borderRadius: sc(5), paddingHorizontal: sc(7), paddingVertical: sc(2), alignSelf: 'flex-start', marginBottom: sc(3) },
  roleBadgeText: { fontSize: sc(10), fontWeight: '800' },
  exNote: { fontSize: sc(11), color: C.muted, lineHeight: sc(16), fontStyle: 'italic' },
  explanationBox: { flexDirection: 'row', backgroundColor: C.surface, borderRadius: sc(12), padding: sc(13), marginBottom: sc(18), borderLeftWidth: sc(3), gap: sc(8), alignItems: 'flex-start', elevation: 1 },
  explanationIcon: { fontSize: sc(14), marginTop: sc(1) },
  explanationText: { flex: 1, fontSize: sc(13), lineHeight: sc(20), color: C.sub, fontStyle: 'italic' },
  learnNavRow: { flexDirection: 'row', gap: sc(10), marginBottom: sc(12) },
  learnNavOutline: { flex: 1, height: sc(48), borderRadius: sc(13), alignItems: 'center', justifyContent: 'center', borderWidth: sc(2), backgroundColor: 'transparent' },
  learnNavOutlineText: { fontSize: sc(14), fontWeight: '700' },
  learnNavFill: { flex: 1, height: sc(48), borderRadius: sc(13), alignItems: 'center', justifyContent: 'center' },
  learnNavFillText: { fontSize: sc(14), fontWeight: '800', color: '#fff' },
  dotsRow: { flexDirection: 'row', justifyContent: 'center', gap: sc(6), marginBottom: sc(4) },
  dot: { width: sc(8), height: sc(8), borderRadius: sc(4), backgroundColor: '#C9D0E8' },
});