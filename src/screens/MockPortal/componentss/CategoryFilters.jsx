import React, {useRef} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';

const COLORS = {
  primary: '#1F3B1F',
  primaryLight: '#E8F5EE',
  primaryMid: '#2EA86B',
  surface: '#FFFFFF',
  surfaceAlt: '#F4F8F5',
  border: '#E0EDE6',
  textSecondary: '#527A62',
  textMuted: '#9DB5A5',
};

const FILTERS = [
  {key: 'all',   label: 'All',         icon: '📚'},
  {key: 'full',  label: 'Full Length', icon: '🎯'},
  {key: 'half',  label: 'Half Length', icon: '⚡'},
  {key: 'topic', label: 'Topic Wise',  icon: '📖'},
];

const CategoryFilter = ({activeFilter, onFilterChange, counts}) => {
  const scrollRef = useRef(null);

  return (
    <View style={styles.wrapper}>
      <ScrollView
        ref={scrollRef}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        bounces={false}>
        {FILTERS.map(f => {
          const active = activeFilter === f.key;
          const count = counts?.[f.key] ?? 0;
          return (
            <TouchableOpacity
              key={f.key}
              style={[styles.tab, active && styles.tabActive]}
              onPress={() => onFilterChange(f.key)}
              activeOpacity={0.75}>
              <View style={styles.tabInner}>
                <Text style={styles.tabIcon}>{f.icon}</Text>
                <Text style={[styles.tabLabel, active && styles.tabLabelActive]}>
                  {f.label}
                </Text>
                <View style={[styles.countBubble, active && styles.countBubbleActive]}>
                  <Text style={[styles.countText, active && styles.countTextActive]}>
                    {count}
                  </Text>
                </View>
              </View>
              {active && <View style={styles.activeUnderline} />}
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    backgroundColor: COLORS.surface,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingVertical: 4,
    flexDirection: 'row',
  },
  tab: {
    marginRight: 4,
    paddingHorizontal: 4,
    paddingBottom: 4,
    position: 'relative',
    alignItems: 'center',
  },
  tabActive: {},
  tabInner: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: 12,
    backgroundColor: COLORS.surfaceAlt,
    borderWidth: 1.5,
    borderColor: COLORS.border,
    gap: 6,
  },
  tabIcon: {
    fontSize: 14,
  },
  tabLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.textSecondary,
    letterSpacing: -0.1,
  },
  tabLabelActive: {
    color: COLORS.primary,
    fontWeight: '700',
  },
  countBubble: {
    backgroundColor: COLORS.border,
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 5,
  },
  countBubbleActive: {
    backgroundColor: COLORS.primaryLight,
  },
  countText: {
    fontSize: 10,
    fontWeight: '800',
    color: COLORS.textMuted,
    letterSpacing: -0.2,
  },
  countTextActive: {
    color: COLORS.primary,
  },
  activeUnderline: {
    position: 'absolute',
    bottom: 0,
    left: 14,
    right: 14,
    height: 2.5,
    borderRadius: 2,
    backgroundColor: COLORS.primary,
  },
});

export default CategoryFilter;