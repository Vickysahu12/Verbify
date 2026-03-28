import React, { useState, useRef, useCallback, useMemo } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity,
  ScrollView, Image, TextInput, SafeAreaView,
  StatusBar, Platform, Dimensions, Animated,
} from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
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

const CATEGORIES = [
  { key: 'All',        emoji: '✨' },
  { key: 'Economics',  emoji: '📈' },
  { key: 'Philosophy', emoji: '🧠' },
  { key: 'Science',    emoji: '🔬' },
  { key: 'Psychology', emoji: '💡' },
  { key: 'History',    emoji: '📜' },
  { key: 'Technology', emoji: '⚙️' },
];

// ─── SKELETON ────────────────────────────────────────────────────────────────
const SkeletonPulse = ({ style }) => {
  const anim = useRef(new Animated.Value(0.4)).current;
  React.useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(anim, { toValue: 1,   duration: 750, useNativeDriver: true }),
        Animated.timing(anim, { toValue: 0.4, duration: 750, useNativeDriver: true }),
      ])
    ).start();
  }, []);
  return <Animated.View style={[{ backgroundColor: C.border, opacity: anim }, style]} />;
};

const ArticleSkeleton = () => (
  <View style={{ paddingTop: sc(8) }}>
    <View style={{ flexDirection: 'row', paddingLeft: sc(16), gap: sc(12), marginBottom: sc(24) }}>
      {[0, 1].map(i => (
        <View key={i} style={{ width: sc(240), gap: sc(8) }}>
          <SkeletonPulse style={{ width: sc(240), height: sc(140), borderRadius: sc(18) }} />
          <SkeletonPulse style={{ width: '60%', height: sc(11), borderRadius: sc(6) }} />
          <SkeletonPulse style={{ width: '90%', height: sc(14), borderRadius: sc(7) }} />
        </View>
      ))}
    </View>
    {[0, 1, 2, 3].map(i => (
      <View key={i} style={{ flexDirection: 'row', marginHorizontal: sc(16), marginBottom: sc(14), gap: sc(12) }}>
        <SkeletonPulse style={{ width: sc(64), height: sc(64), borderRadius: sc(14) }} />
        <View style={{ flex: 1, gap: sc(8), justifyContent: 'center' }}>
          <SkeletonPulse style={{ width: '80%', height: sc(13), borderRadius: sc(6) }} />
          <SkeletonPulse style={{ width: '55%', height: sc(10), borderRadius: sc(5) }} />
        </View>
      </View>
    ))}
  </View>
);

// ─── SECTION HEADER ──────────────────────────────────────────────────────────
const SectionHeader = ({ title }) => (
  <View style={s.sectionHeaderRow}>
    <View style={s.sectionHeaderLeft}>
      <View style={s.sectionBar} />
      <Text style={s.sectionTitle}>{title}</Text>
    </View>
  </View>
);

// ─── FEATURED CARD ───────────────────────────────────────────────────────────
const FeaturedCard = React.memo(({ item, onPress, onBookmark }) => {
  const pressScale = useRef(new Animated.Value(1)).current;
  const lvl = LEVEL_CFG[item.level] ?? LEVEL_CFG.Medium;

  const onPressIn  = () => Animated.spring(pressScale, { toValue: 0.97, useNativeDriver: true, speed: 60 }).start();
  const onPressOut = () => Animated.spring(pressScale, { toValue: 1,    useNativeDriver: true, speed: 60 }).start();

  return (
    <Animated.View style={{ transform: [{ scale: pressScale }] }}>
      <TouchableOpacity
        style={s.featuredCard}
        onPress={() => onPress(item)}
        onPressIn={onPressIn}
        onPressOut={onPressOut}
        activeOpacity={1}
      >
        <View style={s.featuredImgWrap}>
          {item.image_url
            ? <Image source={{ uri: item.image_url }} style={s.featuredImg} />
            : <View style={[s.featuredImg, s.featuredImgPlaceholder]}>
                <Text style={s.featuredImgEmoji}>📰</Text>
              </View>
          }
          <View style={s.featuredTagWrap}>
            <Text style={s.featuredTag}>{item.tag}</Text>
          </View>
          <TouchableOpacity style={s.featuredBookmarkBtn} onPress={() => onBookmark(item.id)}>
            <Text style={s.featuredBookmarkIcon}>{item.is_bookmarked ? '🔖' : '🏷️'}</Text>
          </TouchableOpacity>
          {item.is_read && (
            <View style={s.readBadge}><Text style={s.readBadgeText}>✓ Read</Text></View>
          )}
        </View>
        <View style={s.featuredBody}>
          <Text style={s.featuredTitle} numberOfLines={2}>{item.title}</Text>
          <View style={s.featuredFooter}>
            <Text style={s.featuredTime}>⏱ {item.meta?.split('•')[1]?.trim()}</Text>
            <View style={[s.levelPill, { backgroundColor: lvl.bg }]}>
              <Text style={[s.levelText, { color: lvl.color }]}>{item.level}</Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
});

// ─── LIST CARD ───────────────────────────────────────────────────────────────
const ListCard = React.memo(({ item, onPress, onBookmark }) => {
  const pressScale = useRef(new Animated.Value(1)).current;
  const lvl = LEVEL_CFG[item.level] ?? LEVEL_CFG.Medium;

  const onPressIn  = () => Animated.spring(pressScale, { toValue: 0.98, useNativeDriver: true, speed: 60 }).start();
  const onPressOut = () => Animated.spring(pressScale, { toValue: 1,    useNativeDriver: true, speed: 60 }).start();

  return (
    <Animated.View style={{ transform: [{ scale: pressScale }] }}>
      <TouchableOpacity
        style={[s.listCard, item.is_read && s.listCardRead]}
        onPress={() => onPress(item)}
        onPressIn={onPressIn}
        onPressOut={onPressOut}
        activeOpacity={1}
      >
        <View style={s.listThumbWrap}>
          {item.image_url
            ? <Image source={{ uri: item.image_url }} style={s.listThumb} />
            : <View style={[s.listThumb, s.listThumbPlaceholder]}>
                <Text style={s.listThumbEmoji}>📰</Text>
              </View>
          }
          {item.is_read && <View style={s.listReadDot} />}
        </View>
        <View style={s.listBody}>
          <View style={s.listTagRow}>
            <View style={s.listTagPill}><Text style={s.listTagText}>{item.tag}</Text></View>
            <View style={[s.levelPill, { backgroundColor: lvl.bg }]}>
              <Text style={[s.levelText, { color: lvl.color }]}>{item.level}</Text>
            </View>
          </View>
          <Text style={s.listTitle} numberOfLines={2}>{item.title}</Text>
          <View style={s.listMetaRow}>
            <Text style={s.listSource} numberOfLines={1}>{item.meta?.split('•')[0]?.trim()}</Text>
            <Text style={s.listDot}>·</Text>
            <Text style={s.listTime}>⏱ {item.meta?.split('•')[1]?.trim()}</Text>
          </View>
        </View>
        <TouchableOpacity style={s.listBookmarkBtn} onPress={() => onBookmark(item.id)}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 6 }}>
          <Text style={[s.listBookmarkIcon, { opacity: item.is_bookmarked ? 1 : 0.35 }]}>🔖</Text>
        </TouchableOpacity>
      </TouchableOpacity>
    </Animated.View>
  );
});

// ─── MAIN SCREEN ─────────────────────────────────────────────────────────────
const ArticleScreen = () => {
  const navigation = useNavigation();

  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery,    setSearchQuery]    = useState('');
  const [searchFocused,  setSearchFocused]  = useState(false);
  const [loading,        setLoading]        = useState(true);
  const [articles,       setArticles]       = useState([]);

  // ── Fetch from backend ────────────────────────────────────────────────────
  useFocusEffect(
    useCallback(() => {
      fetchArticles();
    }, [])
  );

  const fetchArticles = async (tag = null, q = null) => {
    try {
      setLoading(true);
      const token  = await AuthService.getToken();
      const params = {};
      if (tag && tag !== 'All') params.tag = tag;
      if (q && q.trim())        params.q   = q.trim();

      const res = await api.get('/articles', {
        headers: { Authorization: `Bearer ${token}` },
        params,
      });
      setArticles(res.data ?? []);
    } catch (err) {
      console.log('ArticleScreen fetch error:', err);
      setArticles([]);
    } finally {
      setLoading(false);
    }
  };

  // ── Filter locally for search (fast UX, no extra API call) ───────────────
  const filtered = useMemo(() => {
    let list = articles;
    if (activeCategory !== 'All') list = list.filter(a => a.tag === activeCategory);
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(a =>
        a.title.toLowerCase().includes(q) || (a.tag ?? '').toLowerCase().includes(q)
      );
    }
    return list;
  }, [articles, activeCategory, searchQuery]);

  // ── Handlers ─────────────────────────────────────────────────────────────
  const handlePress = useCallback((item) => {
    navigation.navigate('ArticleRead', { articleId: item.id });
  }, [navigation]);

  const handleBookmark = useCallback(async (id) => {
    try {
      const token = await AuthService.getToken();
      const res   = await api.post(`/articles/${id}/bookmark`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setArticles(prev =>
        prev.map(a => a.id === id ? { ...a, is_bookmarked: res.data.is_bookmarked } : a)
      );
    } catch (err) {
      console.log('Bookmark error:', err);
      // Optimistic toggle on error
      setArticles(prev =>
        prev.map(a => a.id === id ? { ...a, is_bookmarked: !a.is_bookmarked } : a)
      );
    }
  }, []);

  const handleCategoryChange = useCallback((cat) => {
    setActiveCategory(cat);
    setSearchQuery('');
  }, []);

  return (
    <SafeAreaView style={s.safe}>
      <StatusBar barStyle="dark-content" backgroundColor={C.bg} />

      {/* ── NAVBAR ── */}
      <View style={s.navbar}>
        <View style={s.navLeft}>
          <View style={s.navIconWrap}><Text style={s.navIcon}>📘</Text></View>
          <View>
            <Text style={s.navTitle}>Article Library</Text>
            <Text style={s.navSub}>{filtered.length} passages available</Text>
          </View>
        </View>
        <TouchableOpacity style={s.navProfileBtn} onPress={() => navigation.navigate('Profile')}>
          <Text style={s.navProfileText}>V</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={s.scroll}
        keyboardShouldPersistTaps="handled"
      >
        {/* ── SEARCH BAR ── */}
        <View style={[s.searchBar, searchFocused && s.searchBarFocused]}>
          <Text style={s.searchIcon}>🔍</Text>
          <TextInput
            style={s.searchInput}
            placeholder="Search passages, topics..."
            placeholderTextColor={C.muted}
            value={searchQuery}
            onChangeText={setSearchQuery}
            onFocus={() => setSearchFocused(true)}
            onBlur={() => setSearchFocused(false)}
            returnKeyType="search"
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
              <View style={s.searchClearBtn}><Text style={s.searchClearIcon}>✕</Text></View>
            </TouchableOpacity>
          )}
        </View>

        {/* ── CATEGORY CHIPS ── */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false}
          contentContainerStyle={s.categoriesContent}>
          {CATEGORIES.map(cat => {
            const active = activeCategory === cat.key;
            return (
              <TouchableOpacity key={cat.key} onPress={() => handleCategoryChange(cat.key)}
                style={[s.catChip, active && s.catChipActive]} activeOpacity={0.75}>
                <Text style={s.catEmoji}>{cat.emoji}</Text>
                <Text style={[s.catLabel, active && s.catLabelActive]}>{cat.key}</Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {loading ? <ArticleSkeleton /> : (
          <>
            {filtered.length === 0 && (
              <View style={s.emptyWrap}>
                <View style={s.emptyIconWrap}><Text style={s.emptyEmoji}>🔍</Text></View>
                <Text style={s.emptyTitle}>No articles found</Text>
                <Text style={s.emptySub}>Try a different category or search term</Text>
                <TouchableOpacity style={s.emptyReset}
                  onPress={() => { setActiveCategory('All'); setSearchQuery(''); }}>
                  <Text style={s.emptyResetText}>Clear filters</Text>
                </TouchableOpacity>
              </View>
            )}

            {/* Featured */}
            {filtered.length > 0 && (
              <>
                <SectionHeader title="Recommended for You" />
                <ScrollView horizontal showsHorizontalScrollIndicator={false}
                  contentContainerStyle={s.featuredRow}
                  decelerationRate="fast"
                  snapToInterval={sc(248)} snapToAlignment="start">
                  {filtered.slice(0, 6).map(item => (
                    <FeaturedCard key={item.id} item={item} onPress={handlePress} onBookmark={handleBookmark} />
                  ))}
                  <View style={{ width: sc(16) }} />
                </ScrollView>
              </>
            )}

            {/* All articles list */}
            {filtered.length > 0 && (
              <>
                <SectionHeader title="Daily Practice Passages" />
                {filtered.map(item => (
                  <ListCard key={item.id} item={item} onPress={handlePress} onBookmark={handleBookmark} />
                ))}
              </>
            )}
          </>
        )}

        <View style={{ height: sc(32) }} />
      </ScrollView>
    </SafeAreaView>
  );
};

export default ArticleScreen;

// ─── STYLES ──────────────────────────────────────────────────────────────────
const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: C.bg },
  navbar: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: sc(16),
    paddingTop: Platform.OS === 'android' ? sc(36) : sc(12),
    paddingBottom: sc(12), backgroundColor: C.bg,
  },
  navLeft:    { flexDirection: 'row', alignItems: 'center', gap: sc(10), flex: 1 },
  navIconWrap: { width: sc(38), height: sc(38), borderRadius: sc(12), backgroundColor: C.primaryLight, alignItems: 'center', justifyContent: 'center' },
  navIcon:    { fontSize: sc(18) },
  navTitle:   { fontSize: sc(16), fontWeight: '800', color: C.text, letterSpacing: -0.3 },
  navSub:     { fontSize: sc(10), fontWeight: '500', color: C.muted, marginTop: sc(1) },
  navProfileBtn: { width: sc(38), height: sc(38), borderRadius: sc(13), backgroundColor: C.primary, alignItems: 'center', justifyContent: 'center', elevation: 4 },
  navProfileText: { fontSize: sc(15), fontWeight: '800', color: '#fff' },
  scroll: { paddingBottom: sc(48) },
  searchBar: { flexDirection: 'row', alignItems: 'center', backgroundColor: C.surface, marginHorizontal: sc(16), marginTop: sc(4), marginBottom: sc(4), borderRadius: sc(14), paddingHorizontal: sc(14), paddingVertical: sc(12), borderWidth: 1.5, borderColor: C.border, gap: sc(8) },
  searchBarFocused: { borderColor: C.primaryMid },
  searchIcon: { fontSize: sc(14) },
  searchInput: { flex: 1, fontSize: sc(13), color: C.text, fontWeight: '500', padding: 0 },
  searchClearBtn: { width: sc(20), height: sc(20), borderRadius: sc(10), backgroundColor: C.border, alignItems: 'center', justifyContent: 'center' },
  searchClearIcon: { fontSize: sc(9), color: C.sub, fontWeight: '700' },
  categoriesContent: { paddingHorizontal: sc(16), paddingVertical: sc(12), gap: sc(8) },
  catChip: { flexDirection: 'row', alignItems: 'center', gap: sc(5), paddingHorizontal: sc(12), paddingVertical: sc(7), backgroundColor: C.surface, borderRadius: sc(20), borderWidth: 1, borderColor: C.border },
  catChipActive: { backgroundColor: C.primary, borderColor: 'transparent' },
  catEmoji: { fontSize: sc(12) },
  catLabel: { fontSize: sc(12), fontWeight: '600', color: C.sub },
  catLabelActive: { color: '#fff', fontWeight: '700' },
  sectionHeaderRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: sc(16), marginTop: sc(8), marginBottom: sc(12) },
  sectionHeaderLeft: { flexDirection: 'row', alignItems: 'center', gap: sc(8) },
  sectionBar: { width: sc(4), height: sc(16), borderRadius: sc(2), backgroundColor: C.primaryMid },
  sectionTitle: { fontSize: sc(16), fontWeight: '800', color: C.text, letterSpacing: -0.3 },
  featuredRow: { paddingLeft: sc(16), gap: sc(12), paddingBottom: sc(4) },
  featuredCard: { width: sc(236), backgroundColor: C.surface, borderRadius: sc(18), borderWidth: 1, borderColor: C.border, overflow: 'hidden', elevation: 3, marginBottom: sc(16) },
  featuredImgWrap: { position: 'relative' },
  featuredImg: { width: '100%', height: sc(130) },
  featuredImgPlaceholder: { backgroundColor: C.primaryLight, alignItems: 'center', justifyContent: 'center' },
  featuredImgEmoji: { fontSize: sc(36) },
  featuredTagWrap: { position: 'absolute', top: sc(10), left: sc(10), backgroundColor: 'rgba(15,25,15,0.65)', paddingHorizontal: sc(9), paddingVertical: sc(4), borderRadius: sc(8) },
  featuredTag: { fontSize: sc(10), fontWeight: '700', color: '#fff' },
  featuredBookmarkBtn: { position: 'absolute', top: sc(8), right: sc(10), backgroundColor: 'rgba(255,255,255,0.9)', width: sc(28), height: sc(28), borderRadius: sc(8), alignItems: 'center', justifyContent: 'center' },
  featuredBookmarkIcon: { fontSize: sc(13) },
  readBadge: { position: 'absolute', bottom: sc(8), right: sc(8), backgroundColor: C.primaryMid, paddingHorizontal: sc(7), paddingVertical: sc(3), borderRadius: sc(7) },
  readBadgeText: { fontSize: sc(9), fontWeight: '800', color: '#fff' },
  featuredBody: { padding: sc(12) },
  featuredTitle: { fontSize: sc(14), fontWeight: '700', color: C.text, lineHeight: sc(20), marginBottom: sc(8) },
  featuredFooter: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  featuredTime: { fontSize: sc(10), fontWeight: '500', color: C.muted },
  listCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: C.surface, marginHorizontal: sc(16), marginBottom: sc(10), padding: sc(12), borderRadius: sc(16), borderWidth: 1, borderColor: C.border, elevation: 2 },
  listCardRead: { opacity: 0.75 },
  listThumbWrap: { position: 'relative', marginRight: sc(12) },
  listThumb: { width: sc(64), height: sc(64), borderRadius: sc(13) },
  listThumbPlaceholder: { backgroundColor: C.primaryLight, alignItems: 'center', justifyContent: 'center' },
  listThumbEmoji: { fontSize: sc(24) },
  listReadDot: { position: 'absolute', top: sc(-2), right: sc(-2), width: sc(10), height: sc(10), borderRadius: sc(5), backgroundColor: C.primaryMid, borderWidth: 1.5, borderColor: C.bg },
  listBody: { flex: 1 },
  listTagRow: { flexDirection: 'row', gap: sc(6), marginBottom: sc(5), alignItems: 'center' },
  listTagPill: { backgroundColor: C.primaryLight, paddingHorizontal: sc(7), paddingVertical: sc(3), borderRadius: sc(7) },
  listTagText: { fontSize: sc(9), fontWeight: '700', color: C.primary },
  listTitle: { fontSize: sc(13), fontWeight: '700', color: C.text, lineHeight: sc(19), marginBottom: sc(5) },
  listMetaRow: { flexDirection: 'row', alignItems: 'center', gap: sc(5) },
  listSource: { fontSize: sc(10), color: C.sub, fontWeight: '500', flex: 1 },
  listDot: { fontSize: sc(10), color: C.muted },
  listTime: { fontSize: sc(10), color: C.muted, fontWeight: '500' },
  listBookmarkBtn: { paddingLeft: sc(8), paddingVertical: sc(4) },
  listBookmarkIcon: { fontSize: sc(18) },
  levelPill: { paddingHorizontal: sc(8), paddingVertical: sc(3), borderRadius: sc(7) },
  levelText: { fontSize: sc(10), fontWeight: '700' },
  emptyWrap: { alignItems: 'center', paddingTop: sc(48), paddingHorizontal: sc(40), gap: sc(8) },
  emptyIconWrap: { width: sc(68), height: sc(68), borderRadius: sc(20), backgroundColor: C.primaryLight, alignItems: 'center', justifyContent: 'center', marginBottom: sc(4) },
  emptyEmoji: { fontSize: sc(30) },
  emptyTitle: { fontSize: sc(17), fontWeight: '800', color: C.text },
  emptySub: { fontSize: sc(13), color: C.muted, textAlign: 'center', lineHeight: sc(19) },
  emptyReset: { marginTop: sc(8), backgroundColor: C.primaryLight, paddingHorizontal: sc(20), paddingVertical: sc(10), borderRadius: sc(12) },
  emptyResetText: { fontSize: sc(13), fontWeight: '700', color: C.primary },
  
});