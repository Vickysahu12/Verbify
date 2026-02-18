import React, { useState, useCallback, useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  ActivityIndicator,
  Platform,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Linking } from 'react-native';
//import AsyncStorage from '@react-native-async-storage/async-storage';
import { Audio } from 'react-native';

const { width } = Dimensions.get("window");
const scale = (s) => (width / 375) * s;

const WORDS = [
  {
    id: 1,
    word: "Anachronism",
    phonetic: "/əˈnækrəˌnɪzəm/",
    tag: "HIGH FREQUENCY",
    definition:
      "A thing belonging or appropriate to a period other than that in which it exists, especially a thing that is conspicuously old-fashioned.",
    synonyms: ["Misplacement", "Solecism", "Prochronism"],
    antonyms: ["Contemporary", "Synchrony"],
    context:
      "In an era of instant global communication, the concept of a nation-state with strictly guarded physical borders might increasingly be viewed as a geopolitical anachronism, clinging to 19th-century ideals.",
    source: "THE ECONOMIST",
    articleUrl: "https://www.economist.com",
    tip:
      "Commonly used in RC passages discussing history, technology, or societal evolution. Watch for tone cues where the author describes something as outdated.",
  },
  {
    id: 2,
    word: "Bellicose",
    phonetic: "/ˈbɛlɪˌkoʊs/",
    tag: "HIGH FREQUENCY",
    definition: "Demonstrating aggression and willingness to fight; warlike.",
    synonyms: ["Aggressive", "Pugnacious"],
    antonyms: ["Peaceful", "Calm"],
    context:
      "The leader's bellicose rhetoric heightened tensions between the two nations.",
    source: "THE HINDU",
    articleUrl: "https://www.thehindu.com",
    tip:
      "Often used to describe tone, attitude, or rhetoric in political passages.",
  },
  {
  id: 3,
  word: "Capricious",
  phonetic: "/kəˈprɪʃəs/",
  tag: "HIGH FREQUENCY",
  definition: "Given to sudden and unaccountable changes in mood or behavior.",
  synonyms: ["Unpredictable", "Whimsical"],
  antonyms: ["Consistent", "Stable"],
  context:
    "The manager’s capricious decisions made it difficult for the team to plan effectively.",
  source: "THE HINDU",
  articleUrl: "https://www.thehindu.com",
  tip:
    "Often used in passages describing unstable leadership or erratic policy decisions.",
},

{
  id: 4,
  word: "Didactic",
  phonetic: "/daɪˈdæktɪk/",
  tag: "HIGH FREQUENCY",
  definition: "Intended to teach, particularly in a moralizing or instructive way.",
  synonyms: ["Instructional", "Moralizing"],
  antonyms: ["Entertaining", "Informal"],
  context:
    "The novel adopts a didactic tone to emphasize the importance of ethical governance.",
  source: "THE HINDU",
  articleUrl: "https://www.thehindu.com",
  tip:
    "Commonly appears in RC passages discussing literature, philosophy, or ideology.",
},

{
  id: 5,
  word: "Equanimity",
  phonetic: "/ˌekwəˈnɪməti/",
  tag: "HIGH FREQUENCY",
  definition: "Mental calmness, composure, and evenness of temper, especially in difficult situations.",
  synonyms: ["Composure", "Serenity"],
  antonyms: ["Agitation", "Anxiety"],
  context:
    "She handled the crisis with remarkable equanimity despite mounting pressure.",
  source: "THE HINDU",
  articleUrl: "https://www.thehindu.com",
  tip:
    "Useful in RC passages involving leadership, crisis management, or psychology.",
},

{
  id: 6,
  word: "Obfuscate",
  phonetic: "/ˈɒbfʌskeɪt/",
  tag: "HIGH FREQUENCY",
  definition: "To deliberately make something unclear or difficult to understand.",
  synonyms: ["Confuse", "Blur"],
  antonyms: ["Clarify", "Explain"],
  context:
    "The spokesperson attempted to obfuscate the issue rather than provide a direct answer.",
  source: "THE HINDU",
  articleUrl: "https://www.thehindu.com",
  tip:
    "Frequently used in political or economic editorials where clarity is intentionally avoided.",
},

{
  id: 7,
  word: "Pragmatic",
  phonetic: "/præɡˈmætɪk/",
  tag: "HIGH FREQUENCY",
  definition: "Dealing with things sensibly and realistically in a practical way.",
  synonyms: ["Practical", "Realistic"],
  antonyms: ["Idealistic", "Impractical"],
  context:
    "The government adopted a pragmatic approach to address the fiscal deficit.",
  source: "THE HINDU",
  articleUrl: "https://www.thehindu.com",
  tip:
    "Extremely common in CAT RC passages related to economics, governance, and policy.",
},

];

const VocabLearningScreen = () => {
  const navigation = useNavigation();
  
  const [isLoading, setIsLoading] = useState(false);
  const [words, setWords] = useState(WORDS);
  const [index, setIndex] = useState(0);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [completedWords, setCompletedWords] = useState(new Set());

  const word = words[index];

  useEffect(() => {
    loadProgress();
  }, []);

  const loadProgress = async () => {
    try {
      const progress = await AsyncStorage.getItem('vocab_progress') || '[]';
      setCompletedWords(new Set(JSON.parse(progress)));
      
      const bookmarks = await AsyncStorage.getItem('bookmarked_words') || '[]';
      const bookmarkedList = JSON.parse(bookmarks);
      setIsBookmarked(bookmarkedList.includes(word.id));
    } catch (error) {
      console.log('Error loading progress:', error);
    }
  };

  const handleNext = useCallback(() => {
    if (index < words.length - 1) {
      setIndex((prev) => prev + 1);
    }
  }, [index, words.length]);

  const handlePrevious = useCallback(() => {
    if (index > 0) {
      setIndex((prev) => prev - 1);
    }
  }, [index]);

  const handleBookmark = async () => {
    try {
      const bookmarks = await AsyncStorage.getItem('bookmarked_words') || '[]';
      const bookmarkedList = JSON.parse(bookmarks);
      
      if (!isBookmarked) {
        bookmarkedList.push(word.id);
      } else {
        const idx = bookmarkedList.indexOf(word.id);
        if (idx > -1) bookmarkedList.splice(idx, 1);
      }
      
      await AsyncStorage.setItem('bookmarked_words', JSON.stringify(bookmarkedList));
      setIsBookmarked(!isBookmarked);
      
      // TODO: Sync with backend
      // await vocabService.bookmarkWord(word.id, !isBookmarked);
    } catch (error) {
      console.log('Bookmark error:', error);
    }
  };

  const playPronunciation = () => {
    // TODO: Implement audio playback
    alert('Pronunciation feature coming soon!');
  };

  const openArticle = () => {
    if (word.articleUrl) {
      Linking.openURL(word.articleUrl);
    }
  };

  const handlePractice = () => {
    navigation.navigate("Vocab", {
      wordData: {
        word: word.word,
        pronunciation: word.phonetic,
        question: "Select the most accurate meaning:",
        options: [...word.synonyms, ...word.antonyms].slice(0, 4),
        correct: 0,
        explanation: word.tip,
      },
    });
  };

  const renderContext = () => {
    const parts = word.context.split(new RegExp(`(${word.word})`, 'gi'));
    
    return (
      <Text style={styles.contextText}>
        {parts.map((part, idx) => 
          part.toLowerCase() === word.word.toLowerCase() ? (
            <Text key={idx} style={styles.highlight}>{part}</Text>
          ) : (
            <Text key={idx}>{part}</Text>
          )
        )}
      </Text>
    );
  };

  if (isLoading) {
    return (
      <SafeAreaView style={[styles.safe, styles.centerContent]}>
        <ActivityIndicator size="large" color="#10B981" />
        <Text style={styles.loadingText}>Loading vocabulary...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe}>
      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity 
          onPress={() => navigation.goBack()}
          activeOpacity={0.7}
        >
          <Text style={styles.headerAction}>←</Text>
        </TouchableOpacity>

        <View>
          <Text style={styles.headerTitle}>CAT VOCAB</Text>
          <Text style={styles.headerSub}>
            Word {index + 1} of {words.length}
          </Text>
        </View>

        <TouchableOpacity onPress={handleBookmark} activeOpacity={0.7}>
          <Text style={styles.headerAction}>
            {isBookmarked ? '★' : '☆'}
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.container}
      >
        {/* TAG */}
        <View style={styles.tag}>
          <Text style={styles.tagText}>{word.tag}</Text>
        </View>

        {/* WORD */}
        <Text style={styles.word}>{word.word}</Text>

        {/* LEARNED BADGE */}
        {completedWords.has(word.id) && (
          <View style={styles.learnedBadge}>
            <Text style={styles.learnedText}>✓ Learned</Text>
          </View>
        )}

        {/* PRONUNCIATION */}
        <View style={styles.pronounceBox}>
          <Text style={styles.phonetic}>{word.phonetic}</Text>
          <TouchableOpacity onPress={playPronunciation} activeOpacity={0.7}>
            <Text style={styles.pronounceText}>🔊 PRONOUNCE</Text>
          </TouchableOpacity>
        </View>

        {/* DEFINITION */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>📘 Definition</Text>
          <View style={styles.definitionCard}>
            <Text style={styles.definitionText}>{word.definition}</Text>
          </View>
        </View>

        {/* SYNONYMS & ANTONYMS */}
        <View style={styles.dualSection}>
          <View style={{ flex: 1 }}>
            <Text style={styles.sectionTitle}>↔️ Synonyms</Text>
            {word.synonyms.map((item) => (
              <View key={item} style={styles.chip}>
                <Text style={styles.chipText}>{item}</Text>
              </View>
            ))}
          </View>

          <View style={{ flex: 1 }}>
            <Text style={styles.sectionTitle}>🚫 Antonyms</Text>
            {word.antonyms.map((item) => (
              <View key={item} style={styles.chip}>
                <Text style={styles.chipText}>{item}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* CONTEXT */}
        <View style={styles.section}>
          <View style={styles.contextHeader}>
            <Text style={styles.sectionTitle}>📰 Editorial Context</Text>
            <Text style={styles.source}>SOURCE: {word.source}</Text>
          </View>

          <View style={styles.contextCard}>
            {renderContext()}
            <TouchableOpacity onPress={openArticle} activeOpacity={0.7}>
              <Text style={styles.readMore}>Read Full Article ↗</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* TIP */}
        <View style={styles.tipCard}>
          <Text style={styles.tipTitle}>💡 CAT EXAM TIP</Text>
          <Text style={styles.tipText}>{word.tip}</Text>
        </View>
      </ScrollView>

      {/* BOTTOM BAR */}
      <View style={styles.bottomBar}>
        <TouchableOpacity
          style={[
            styles.navBtn,
            index === 0 && styles.navBtnDisabled
          ]}
          onPress={handlePrevious}
          disabled={index === 0}
          activeOpacity={0.7}
        >
          <Text style={styles.navBtnText}>← Prev</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.navBtn,
            index === words.length - 1 && styles.navBtnDisabled
          ]}
          onPress={handleNext}
          disabled={index === words.length - 1}
          activeOpacity={0.7}
        >
          <Text style={styles.navBtnText}>Next →</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.practiceBtn} 
          onPress={handlePractice}
          activeOpacity={0.8}
        >
          <Text style={styles.practiceText}>Practice</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default VocabLearningScreen;

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: "#FCFCF7",
  },

  centerContent: {
    justifyContent: 'center',
    alignItems: 'center',
  },

  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: '#6B7280',
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: scale(16),
    backgroundColor: "#FCFCF7",
    zIndex: 10,
    paddingTop: Platform.OS === 'ios' ? scale(10) : scale(40),
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
      },
      android: {
        elevation: 2,
      },
    }),
  },

  container: {
    padding: scale(16),
    paddingBottom: scale(140),
  },

  headerTitle: {
    fontSize: scale(12),
    fontWeight: "700",
    color: "#0F172A",
    textAlign: "center",
  },

  headerSub: {
    fontSize: scale(11),
    color: "#1F3B1F",
    textAlign: "center",
    marginTop: 2,
  },

  headerAction: {
    fontSize: scale(20),
    fontWeight: "700",
    color: "#0F172A",
  },

  tag: {
    alignSelf: "center",
    backgroundColor: "#ECFDF5",
    paddingHorizontal: scale(14),
    paddingVertical: scale(5),
    borderRadius: 20,
    marginBottom: scale(16),
  },

  tagText: {
    fontSize: scale(10),
    fontWeight: "700",
    color: "#1F3B1F",
    letterSpacing: 1,
  },

  word: {
    fontSize: scale(34),
    fontWeight: "800",
    color: "#0F172A",
    textAlign: "center",
    marginBottom: scale(8),
  },

  learnedBadge: {
    alignSelf: 'center',
    backgroundColor: '#1F3B1F',
    paddingHorizontal: scale(12),
    paddingVertical: scale(4),
    borderRadius: 12,
    marginBottom: scale(14),
  },

  learnedText: {
    fontSize: scale(11),
    fontWeight: '700',
    color: '#FFFFFF',
  },

  pronounceBox: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: scale(14),
    padding: scale(14),
    marginBottom: scale(22),
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.08,
        shadowRadius: 4,
      },
      android: {
        elevation: 2,
      },
    }),
  },

  phonetic: {
    fontSize: scale(14),
    color: "#374151",
    fontStyle: 'italic',
  },

  pronounceText: {
    fontSize: scale(11),
    fontWeight: "700",
    color: "#1F3B1F",
  },

  section: {
    marginBottom: scale(24),
  },

  sectionTitle: {
    fontSize: scale(14),
    fontWeight: "700",
    color: "#0F172A",
    marginBottom: scale(10),
  },

  definitionCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: scale(14),
    padding: scale(16),
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.08,
        shadowRadius: 4,
      },
      android: {
        elevation: 2,
      },
    }),
  },

  definitionText: {
    fontSize: scale(14),
    color: "#374151",
    lineHeight: 22,
    fontStyle: "italic",
  },

  dualSection: {
    flexDirection: "row",
    gap: scale(14),
    marginBottom: scale(24),
  },

  chip: {
    backgroundColor: "#FFFFFF",
    paddingVertical: scale(8),
    paddingHorizontal: scale(12),
    borderRadius: 10,
    marginBottom: 8,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.06,
        shadowRadius: 2,
      },
      android: {
        elevation: 1,
      },
    }),
  },

  chipText: {
    fontSize: scale(12),
    color: "#0F172A",
    fontWeight: '500',
  },

  contextHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  source: {
    fontSize: scale(10),
    fontWeight: "700",
    color: "#6B7280",
  },

  contextCard: {
    backgroundColor: "#ECFDF5",
    borderRadius: scale(14),
    padding: scale(16),
    borderWidth: 1,
    borderColor: '#D1FAE5',
  },

  contextText: {
    fontSize: scale(13),
    color: "#065F46",
    lineHeight: 21,
  },

  highlight: {
    backgroundColor: "#A7F3D0",
    fontWeight: "800",
    paddingHorizontal: 2,
  },

  readMore: {
    marginTop: 12,
    fontSize: scale(12),
    fontWeight: "700",
    color: "#10B981",
  },

  tipCard: {
    backgroundColor: "#FEF3C7",
    borderRadius: scale(14),
    padding: scale(16),
    borderWidth: 1,
    borderColor: '#FDE68A',
  },

  tipTitle: {
    fontSize: scale(13),
    fontWeight: "700",
    color: "#92400E",
    marginBottom: 8,
  },

  tipText: {
    fontSize: scale(12),
    color: "#78350F",
    lineHeight: 19,
  },

  bottomBar: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: "row",
    gap: scale(10),
    padding: scale(16),
    paddingBottom: Platform.OS === 'ios' ? scale(24) : scale(16),
    backgroundColor: "#FCFCF7",
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 8,
      },
    }),
  },

  navBtn: {
    paddingHorizontal: scale(16),
    height: 50,
    borderRadius: 14,
    backgroundColor: "#1F3B1F",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: '#D1FAE5',
  },

  navBtnDisabled: {
    opacity: 0.3,
  },

  navBtnText: {
    fontWeight: "700",
    color: "#fff",
    fontSize: scale(13),
  },

  practiceBtn: {
    flex: 1,
    height: 50,
    borderRadius: 14,
    backgroundColor: "#1F3B1F",
    alignItems: "center",
    justifyContent: "center",
    ...Platform.select({
      ios: {
        shadowColor: "#10B981",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
      },
      android: {
        elevation: 4,
      },
    }),
  },

  practiceText: {
    fontSize: scale(14),
    fontWeight: "700",
    color: "#FFFFFF",
  },
});