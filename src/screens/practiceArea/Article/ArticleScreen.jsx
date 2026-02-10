import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  TextInput,
} from "react-native";

/* ───────── DATA ───────── */

const categories = ["All", "Economics", "Philosophy", "Science", "Psychology"];

const articlesByCategory = {
  All: [
    {
      image: require("../../../assets/images/Article1.jpg"),
      tag: "EDITOR'S CHOICE",
      title: "The Future of AI in Ethics: A Deep Dive",
      meta: "Aeon • 12 min",
      level: "ADVANCED",
      levelColor: "#FEE2E2",
      levelText: "#DC2626",
    },
    {
      image: require("../../../assets/images/article2.jpg"),
      tag: "TOP RATED",
      title: "The Stoic Response to Chaos",
      meta: "The Guardian • 10 min",
      level: "INTERMEDIATE",
      levelColor: "#E0F2FE",
      levelText: "#0284C7",
    },
  ],

  Economics: [
    {
      image: require("../../../assets/images/article3.jpg"),
      tag: "ECONOMICS",
      title: "The New Economics of Space Exploration",
      meta: "The Economist • 15 min",
      level: "ADVANCED",
      levelColor: "#DBEAFE",
      levelText: "#2563EB",
    },
  ],

  Philosophy: [
    {
      image: require("../../../assets/images/article2.jpg"),
      tag: "PHILOSOPHY",
      title: "Nietzsche on Meaning and Suffering",
      meta: "Aeon • 9 min",
      level: "INTERMEDIATE",
      levelColor: "#EDE9FE",
      levelText: "#7C3AED",
    },
  ],

  Science: [
    {
      image: require("../../../assets/images/quantum.jpg"),
      tag: "SCIENCE",
      title: "Quantum Supremacy: Beyond the Hype",
      meta: "Nature • 18 min",
      level: "INTERMEDIATE",
      levelColor: "#FEF3C7",
      levelText: "#D97706",
    },
  ],

  Psychology: [
    {
      image: require("../../../assets/images/article4.jpg"),
      tag: "PSYCHOLOGY",
      title: "Cognitive Biases in Decision Making",
      meta: "Smithsonian • 8 min",
      level: "BEGINNER",
      levelColor: "#DCFCE7",
      levelText: "#16A34A",
    },
  ],
};

/* ───────── SCREEN ───────── */

const ArticleScreen = () => {
  const [activeCategory, setActiveCategory] = useState("All");

  return (
    <View style={styles.wrapper}>
      {/* HEADER */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={styles.headerIcon}>📘</Text>
          <Text style={styles.headerTitle}>Article Library</Text>
        </View>

        <TouchableOpacity style={styles.profileCircle}>
          <Text style={styles.profileText}>V</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 120 }}
      >
        {/* SEARCH */}
        <View style={styles.searchBox}>
          <Text style={styles.searchIcon}>🔍</Text>
          <TextInput
            placeholder="Search RC passages, sources..."
            placeholderTextColor="#9CA3AF"
            style={styles.searchInput}
          />
        </View>

        {/* FILTERS */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterRow}
        >
          {categories.map((cat) => (
            <FilterChip
              key={cat}
              label={cat}
              active={activeCategory === cat}
              onPress={() => setActiveCategory(cat)}
            />
          ))}
        </ScrollView>

        {/* RECOMMENDED */}
        <SectionHeader title="Recommended for You" style={styles.header22}/>

        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {articlesByCategory[activeCategory]?.map((item, index) => (
            <ArticleCard key={index} {...item} />
          ))}
        </ScrollView>

        {/* DAILY PRACTICE */}
        <SectionHeader title="Daily Practice Passages" />

        {articlesByCategory[activeCategory]?.map((item, index) => (
          <ListCard
            key={index}
            image={item.image}
            title={item.title}
            time={item.meta.split("•")[1]}
            level={item.level}
            source={item.meta.split("•")[0]}
            levelColor={item.levelColor}
            levelText={item.levelText}
          />
        ))}
      </ScrollView>
    </View>
  );
};

export default ArticleScreen;

/* ───────── COMPONENTS ───────── */

const SectionHeader = ({ title }) => (
  <View style={styles.sectionHeader}>
    <Text style={styles.sectionTitle}>{title}</Text>
    <Text style={styles.seeAll}>See All</Text>
  </View>
);

const FilterChip = ({ label, active, onPress }) => (
  <TouchableOpacity
    onPress={onPress}
    style={[
      styles.filterChip,
      active && { backgroundColor: "#2563EB" },
    ]}
  >
    <Text
      style={[
        styles.filterText,
        active && { color: "#FFFFFF", fontWeight: "600" },
      ]}
    >
      {label}
    </Text>
  </TouchableOpacity>
);

const ArticleCard = ({
  image,
  tag,
  title,
  meta,
  level,
  levelColor,
  levelText,
}) => (
  <View style={styles.articleCard}>
    <Image source={image} style={styles.articleImage} />
    <Text style={styles.articleTag}>{tag}</Text>

    <Text style={styles.articleTitle}>{title}</Text>
    <View style={styles.articleFooter}>
      <Text style={styles.articleMeta}>{meta}</Text>
      <View style={[styles.levelBadge, { backgroundColor: levelColor }]}>
        <Text style={[styles.levelText, { color: levelText }]}>{level}</Text>
      </View>
    </View>
  </View>
);

const ListCard = ({
  image,
  title,
  time,
  level,
  source,
  levelColor,
  levelText,
}) => (
  <TouchableOpacity style={styles.listCard}>
    <Image source={image} style={styles.listImage} />

    <View style={{ flex: 1 }}>
      <Text style={styles.listTitle}>{title}</Text>
      <View style={styles.listMetaRow}>
        <Text style={styles.listMeta}>⏱ {time}</Text>
        <View style={[styles.levelBadge, { backgroundColor: levelColor }]}>
          <Text style={[styles.levelText, { color: levelText }]}>{level}</Text>
        </View>
      </View>
      <Text style={styles.listSource}>{source}</Text>
    </View>

    <Text style={styles.bookmark}>🔖</Text>
  </TouchableOpacity>
);

/* ───────── STYLES ───────── */

const styles = StyleSheet.create({
  wrapper: { flex: 1, backgroundColor: "#F9FAF6" },

  header: {
    paddingTop: 42,
    paddingBottom: 20,
    paddingHorizontal: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  headerLeft: { flexDirection: "row", alignItems: "center" },
  headerIcon: { fontSize: 22, marginRight: 8 },
  headerTitle: { fontSize: 20, fontWeight: "700", color: "#111827" },

  profileCircle: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: "#2563EB",
    alignItems: "center",
    justifyContent: "center",
  },
  profileText: { color: "#FFF", fontWeight: "600" },

  searchBox: {
  flexDirection: "row",
  alignItems: "center",
  backgroundColor: "#FFF",
  marginHorizontal: 20,
  marginTop: 6,
  borderRadius: 16,
  paddingHorizontal: 14,
  paddingVertical: 14, // ⬅️ slightly more
  borderWidth: 1,
  borderColor: "#E5E7EB",
},

  searchIcon: { marginRight: 8 },
  searchInput: { flex: 1, fontSize: 14 },

  filterRow: {
  paddingHorizontal: 20,
  paddingTop: 14,
  paddingBottom: 22, // ⬅️ more gap before section
},

  filterChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: "#FFF",
    borderRadius: 20,
    marginRight: 10,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  filterText: { fontSize: 13, color: "#374151" },

  sectionHeader: {
  flexDirection: "row",
  justifyContent: "space-between",
  alignItems: "center",
  paddingHorizontal: 20,
  marginBottom: 14,
  marginTop: 10, // ⬅️ NEW
},

sectionTitle: {
  fontSize: 18,
  fontWeight: "700",
  color: "#000",
},

  seeAll: { fontSize: 13, color: "#2563EB" },

  articleCard: {
    width: 280,
    backgroundColor: "#FFF",
    borderRadius: 20,
    marginLeft: 20,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  articleImage: {
    width: "100%",
    height: 150,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  articleTag: {
    position: "absolute",
    top: 12,
    left: 12,
    backgroundColor: "rgba(0,0,0,0.6)",
    color: "#FFF",
    fontSize: 11,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
  },
  articleTitle: {
    fontSize: 16,
    fontWeight: "700",
    paddingHorizontal: 14,
    marginTop: 12,
    color:"#000"
  },
  articleFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 14,
    marginVertical: 10,
  },
  articleMeta: { fontSize: 12, color: "#6B7280" },

  listCard: {
    flexDirection: "row",
    backgroundColor: "#FFF",
    marginHorizontal: 20,
    marginBottom: 14,
    padding: 12,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  listImage: { width: 54, height: 54, borderRadius: 12, marginRight: 12 },
  listTitle: { fontSize: 15, fontWeight: "600",color:"#000" },
  listMetaRow: { flexDirection: "row", alignItems: "center", marginTop: 4 },
  listMeta: { fontSize: 12, color: "#6B7280", marginRight: 8 },
  listSource: { fontSize: 12, color: "#6B7280", marginTop: 2 },
  bookmark: { fontSize: 18 },

  levelBadge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 10 },
  levelText: { fontSize: 11, fontWeight: "600" },
});
