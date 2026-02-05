import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Dimensions,
} from "react-native";
import { useNavigation } from "@react-navigation/native";

const { width } = Dimensions.get("window");
const scale = (s) => (width / 375) * s;

const DUMMY_WORD = {
  word: "Ephemeral",
  pronunciation: "/əˈfem(ə)rəl/",
  question: "Select the most accurate meaning:",
  options: ["Short-lived", "Permanent", "Transparent", "Weak"],
  correct: 0,
  explanation:
    "Ephemeral means lasting for a very short time.",
};


const PracticeScreen = () => {
  const navigation = useNavigation();

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView showsVerticalScrollIndicator={false} stickyHeaderIndices={[0]}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>
            Ready to Ace the CAT, Alex?
          </Text>
        </View>

        {/* Daily Goal Tracker */}
        <View style={styles.goalCard}>
          <View style={styles.goalTop}>
            <Text style={styles.goalTitle}>Daily Goal Tracker</Text>
            <Text style={styles.goalCount}>7/20</Text>
          </View>

          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: "35%" }]} />
          </View>

          <Text style={styles.goalSub}>
            7/20 Questions solved today. You're on a 5-day streak!
          </Text>
        </View>

        {/* Section Title */}
        <Text style={styles.sectionTitle}>Study Modules</Text>

        
        {/* VOCAB */}
<View style={styles.card}>
  <Text style={[styles.tag, styles.highPriority]}>
    HIGH PRIORITY
  </Text>

  <Text style={styles.cardTitle}>VOCAB</Text>
  <Text style={styles.cardDesc}>
    Master 500+ high-frequency CAT words and context usage.
  </Text>

  <View style={styles.cardBottom}>
    <View style={styles.cardProgress}>
      <View style={[styles.cardProgressFill, { width: "45%" }]} />
    </View>
    <Text style={styles.percent}>45%</Text>
  </View>

  {/* 🔥 Dual CTA */}
  <View style={styles.dualCTA}>
    <TouchableOpacity
      style={[styles.ctaSmall, styles.ctaPrimary]}
      onPress={() => navigation.navigate("VocabLearning")}
    >
      <Text style={styles.ctaPrimaryText}>Learn</Text>
    </TouchableOpacity>

    <TouchableOpacity
  style={[styles.ctaSmall, styles.ctaSecondary]}
  onPress={() =>
    navigation.navigate("Vocab", {
      wordData: DUMMY_WORD,
    })
  }
>
  <Text style={styles.ctaSecondaryText}>Practice</Text>
</TouchableOpacity>

  </View>
</View>

        {/* RC */}
        {/* RC */}
<View style={styles.card}>
  <Text style={[styles.tag, styles.newContent]}>
    NEW CONTENT
  </Text>

  <Text style={styles.cardTitle}>RC</Text>
  <Text style={styles.cardDesc}>
    3 passages remaining for today's streak. Focus: Philosophy & Arts.
  </Text>

  <View style={styles.cardBottom}>
    <View style={styles.cardProgress}>
      <View style={[styles.cardProgressFill, { width: "12%" }]} />
    </View>
    <Text style={styles.percent}>12%</Text>
  </View>

  <View style={styles.dualCTA}>
    <TouchableOpacity
      style={[styles.ctaSmall, styles.ctaPrimary]}
      onPress={() => navigation.navigate("RcRead")}
    >
      <Text style={styles.ctaPrimaryText}>Read</Text>
    </TouchableOpacity>

    <TouchableOpacity
      style={[styles.ctaSmall, styles.ctaSecondary]}
      onPress={() => navigation.navigate("RC")}
    >
      <Text style={styles.ctaSecondaryText}>Practice</Text>
    </TouchableOpacity>
  </View>
</View>


        {/* ESSAY */}
        {/* ESSAY */}
<View style={styles.card}>
  <Text style={styles.cardTitle}>ESSAY / ARTICLE</Text>
  <Text style={styles.cardDesc}>
    Daily editorial analysis from The Guardian and AEON.
  </Text>

  <View style={styles.cardBottom}>
    <View style={styles.cardProgress}>
      <View style={[styles.cardProgressFill, { width: "80%" }]} />
    </View>
    <Text style={styles.percent}>80%</Text>
  </View>

  <View style={styles.dualCTA}>
    <TouchableOpacity
      style={[styles.ctaSmall, styles.ctaPrimary]}
      onPress={() => navigation.navigate("Article")}
    >
      <Text style={styles.ctaPrimaryText}>Read</Text>
    </TouchableOpacity>

    <TouchableOpacity
      style={[styles.ctaSmall, styles.ctaSecondary]}
      onPress={() => navigation.navigate("ArticleDetail")}
    >
      <Text style={styles.ctaSecondaryText}>Analyse</Text>
    </TouchableOpacity>
  </View>
</View>

        {/* VA */}
        {/* VA */}
<View style={styles.card}>
  <Text style={styles.cardTitle}>VERBAL ABILITY</Text>
  <Text style={styles.cardDesc}>
    Parajumbles, Odd One Out, and Critical Reasoning drills.
  </Text>

  <View style={styles.cardBottom}>
    <View style={styles.cardProgress}>
      <View style={[styles.cardProgressFill, { width: "30%" }]} />
    </View>
    <Text style={styles.percent}>30%</Text>
  </View>

  <View style={styles.dualCTA}>
    <TouchableOpacity
      style={[styles.ctaSmall, styles.ctaPrimary]}
      onPress={() => navigation.navigate("VaConcept")}
    >
      <Text style={styles.ctaPrimaryText}>Concepts</Text>
    </TouchableOpacity>

    <TouchableOpacity
      style={[styles.ctaSmall, styles.ctaSecondary]}
      onPress={() => navigation.navigate("VA")}
    >
      <Text style={styles.ctaSecondaryText}>Practice</Text>
    </TouchableOpacity>
  </View>
</View>

      </ScrollView>
    </SafeAreaView>
  );
};

export default PracticeScreen;

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: "#F9FAF6",
    paddingHorizontal: scale(16),
  },
header: {
  backgroundColor: "#F9FAF6",   // same as screen
  paddingVertical: scale(14),
  paddingHorizontal: scale(4),
},

  headerTitle: {
    fontSize: scale(18),
    fontWeight: "700",
    color: "#1F3B1F",
    marginTop:30,
    paddingLeft:50
  },

  /* Goal */
  goalCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: scale(14),
    padding: scale(16),
    marginBottom: scale(20),
    elevation: 2,
  },

  goalTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: scale(8),
  },

  goalTitle: {
    fontSize: scale(14),
    fontWeight: "600",
    color: "#1F3B1F",
  },

  goalCount: {
    fontSize: scale(14),
    fontWeight: "700",
    color: "#1F3B1F",
  },

  goalSub: {
    fontSize: scale(12),
    color: "#6B7280",
    marginTop: scale(8),
  },

  progressBar: {
    height: 6,
    backgroundColor: "#E5E7EB",
    borderRadius: 6,
    overflow: "hidden",
  },

  progressFill: {
    height: "100%",
    backgroundColor: "#1F3B1F",
  },

  sectionTitle: {
    fontSize: scale(16),
    fontWeight: "700",
    color: "#1F3B1F",
    marginBottom: scale(12),
  },

  /* Cards */
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: scale(16),
    padding: scale(16),
    marginBottom: scale(20),
    elevation: 2,
  },

  tag: {
    alignSelf: "flex-start",
    fontSize: scale(10),
    fontWeight: "700",
    paddingHorizontal: scale(10),
    paddingVertical: scale(3),
    borderRadius: 20,
    marginBottom: scale(10),
  },

  highPriority: {
    backgroundColor: "#FEF3C7",
    color: "#92400E",
  },

  newContent: {
    backgroundColor: "#DCFCE7",
    color: "#166534",
  },

  cardTitle: {
    fontSize: scale(16),
    fontWeight: "700",
    color: "#0F172A",
    marginBottom: scale(6),
  },

  cardDesc: {
    fontSize: scale(13),
    color: "#4B5563",
    marginBottom: scale(14),
  },

  cardBottom: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: scale(14),
  },

  cardProgress: {
    flex: 1,
    height: 6,
    backgroundColor: "#E5E7EB",
    borderRadius: 6,
    overflow: "hidden",
  },

  cardProgressFill: {
    height: "100%",
    backgroundColor: "#1F3B1F",
  },

  percent: {
    marginLeft: scale(8),
    fontSize: scale(12),
    fontWeight: "600",
    color: "#1F3B1F",
  },

  cta: {
    backgroundColor: "#1F3B1F",
    paddingVertical: scale(10),
    borderRadius: scale(10),
    alignItems: "center",
  },

  ctaText: {
    color: "#FFFFFF",
    fontSize: scale(14),
    fontWeight: "700",
  },
  dualCTA: {
  flexDirection: "row",
  gap: scale(12),
},

ctaSmall: {
  flex: 1,
  paddingVertical: scale(10),
  borderRadius: scale(10),
  alignItems: "center",
},

ctaPrimary: {
  backgroundColor: "#1F3B1F",
},

ctaSecondary: {
  backgroundColor: "#FFFFFF",
  borderWidth: 1,
  borderColor: "#1F3B1F",
},

ctaPrimaryText: {
  color: "#FFFFFF",
  fontSize: scale(13),
  fontWeight: "700",
},

ctaSecondaryText: {
  color: "#1F3B1F",
  fontSize: scale(13),
  fontWeight: "700",
},

});
