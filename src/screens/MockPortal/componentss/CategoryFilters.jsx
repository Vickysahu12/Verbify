/**
 * CategoryFilter.jsx
 * ─────────────────────────────────────────────────────────────────────────────
 * FIXES:
 * - Active tab tabInner background + border now visually updates (was missing)
 * - sc() responsive scaling added throughout
 * - Active underline length matches pill width properly
 * - Cleaner active/inactive state contrast
 * ─────────────────────────────────────────────────────────────────────────────
 */

import React, { useRef } from 'react';
import {
  View, Text, StyleSheet, ScrollView,
  TouchableOpacity, Dimensions,
} from 'react-native';

const { width: SW } = Dimensions.get('window');
const sc = n => (SW / 390) * n;

const C = {
  primary:      '#1F3B1F',
  primaryLight: '#E8F5EE',
  primaryMid:   '#2EA86B',
  primaryBdr:   '#C5E8D4',
  surface:      '#FFFFFF',
  surfaceAlt:   '#F4F8F5',
  border:       '#E0EDE6',
  textSecondary:'#527A62',
  textMuted:    '#9DB5A5',
};

const FILTERS = [
  { key: 'all',   label: 'All',         icon: '📚' },
  { key: 'full',  label: 'Full Length', icon: '🎯' },
  { key: 'half',  label: 'Half Length', icon: '⚡' },
  { key: 'topic', label: 'Topic Wise',  icon: '📖' },
];

const CategoryFilter = ({ activeFilter, onFilterChange, counts }) => {
  const scrollRef = useRef(null);

  return (
    <View style={s.wrapper}>
      <ScrollView
        ref={scrollRef}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={s.scrollContent}
        bounces={false}
      >
        {FILTERS.map(f => {
          const active = activeFilter === f.key;
          const count  = counts?.[f.key] ?? 0;

          return (
            <TouchableOpacity
              key={f.key}
              style={s.tab}
              onPress={() => onFilterChange(f.key)}
              activeOpacity={0.75}
            >
              {/* ✅ FIX: Active state now properly changes tabInner bg + border */}
              <View style={[s.tabInner, active && s.tabInnerActive]}>
                <Text style={s.tabIcon}>{f.icon}</Text>
                <Text style={[s.tabLabel, active && s.tabLabelActive]}>
                  {f.label}
                </Text>
                <View style={[s.countBubble, active && s.countBubbleActive]}>
                  <Text style={[s.countText, active && s.countTextActive]}>
                    {count}
                  </Text>
                </View>
              </View>

              {/* Active underline — sits flush at bottom of wrapper */}
              {active && <View style={s.activeUnderline} />}
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
};

const s = StyleSheet.create({
  wrapper: {
    backgroundColor: C.surface,
    borderBottomWidth: 1,
    borderBottomColor: C.border,
  },
  scrollContent: {
    paddingHorizontal: sc(14),
    paddingTop: sc(8),
    paddingBottom: 0,         // underline sits at absolute bottom of tab
    flexDirection: 'row',
    alignItems: 'flex-end',   // underline aligns to wrapper bottom edge
  },

  tab: {
    marginRight: sc(6),
    alignItems: 'center',
    paddingBottom: sc(6),     // space between pill and underline
    position: 'relative',
  },

  // Inactive pill
  tabInner: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: sc(13),
    paddingVertical: sc(9),
    borderRadius: sc(12),
    backgroundColor: C.surfaceAlt,
    borderWidth: 1.5,
    borderColor: C.border,
    gap: sc(5),
  },
  // ✅ Active pill — green tint bg + green border
  tabInnerActive: {
    backgroundColor: C.primaryLight,
    borderColor: C.primaryBdr,
  },

  tabIcon:  { fontSize: sc(14) },

  tabLabel: {
    fontSize: sc(13), fontWeight: '600',
    color: C.textSecondary, letterSpacing: -0.1,
  },
  tabLabelActive: {
    color: C.primary, fontWeight: '800',
  },

  countBubble: {
    backgroundColor: C.border,
    borderRadius: sc(10),
    minWidth: sc(20), height: sc(20),
    justifyContent: 'center', alignItems: 'center',
    paddingHorizontal: sc(5),
  },
  countBubbleActive: {
    backgroundColor: C.primaryMid,
  },

  countText: {
    fontSize: sc(10), fontWeight: '800',
    color: C.textMuted, letterSpacing: -0.2,
  },
  countTextActive: {
    color: '#fff',
  },

  // Underline — spans full pill width
  activeUnderline: {
    position: 'absolute',
    bottom: 0,
    left: 0, right: 0,
    height: sc(2.5),
    borderRadius: sc(2),
    backgroundColor: C.primary,
  },
});

export default CategoryFilter;