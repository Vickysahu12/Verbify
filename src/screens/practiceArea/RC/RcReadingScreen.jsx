import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Platform,
  LayoutAnimation,
  UIManager,
  Alert,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import Icon from "react-native-vector-icons/Ionicons";
//import AsyncStorage from '@react-native-async-storage/async-storage';
import backicon from "../../../assets/icon/backbutton.png"

const { width } = Dimensions.get("window");
const scale = (s) => (width / 375) * s;

// Enable LayoutAnimation on Android
if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const COURSE_CONTENT = [
  {
    id: 1,
    title: "Understanding Tone",
    bullets: [
      "Identify adjectives & adverbs revealing author sentiment.",
      "Look for structural pivots like 'However', 'Yet'.",
      "Notice intensity words: 'utterly', 'merely', 'profoundly'.",
    ],
    tip: "Frequent rhetorical questions often indicate a skeptical or inquisitive tone.",
  },
  {
    id: 2,
    title: "Identifying Main Idea",
    bullets: [
      "First & last paragraphs often contain thesis statements.",
      "Look for repeated concepts or phrases.",
      "Check for summarizing sentences with 'thus', 'therefore'.",
    ],
    tip: "The main idea is rarely in the middle—scan first and last lines.",
  },
  {
    id: 3,
    title: "Inference Questions",
    bullets: [
      "Don't extrapolate beyond what's stated.",
      "Look for logical extensions of the author's argument.",
      "Eliminate options that contradict the passage.",
    ],
    tip: "If you have to assume too much, it's probably wrong.",
  },
];

const RCLearningScreen = () => {
  const navigation = useNavigation();
  
  const [openIndex, setOpenIndex] = useState(0);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [completedSteps, setCompletedSteps] = useState(new Set());
  const [watchedVideo, setWatchedVideo] = useState(false);

  const totalSteps = COURSE_CONTENT.length + 1;
  const completedCount = completedSteps.size + (watchedVideo ? 1 : 0);
  const progress = Math.round((completedCount / totalSteps) * 100);

  useEffect(() => {
    loadProgress();
  }, []);

  const loadProgress = async () => {
    try {
      const progress = await AsyncStorage.getItem('rc_progress') || '{}';
      const data = JSON.parse(progress);
      setCompletedSteps(new Set(data.completed || []));
      setWatchedVideo(data.watchedVideo || false);
      
      const bookmarks = await AsyncStorage.getItem('rc_bookmarks') || '[]';
      const list = JSON.parse(bookmarks);
      setIsBookmarked(list.includes('rc_mastery_guide'));
    } catch (error) {
      console.log('Load progress error:', error);
    }
  };

  const handleBookmark = async () => {
    try {
      const bookmarks = await AsyncStorage.getItem('rc_bookmarks') || '[]';
      const list = JSON.parse(bookmarks);
      
      if (!isBookmarked) {
        list.push('rc_mastery_guide');
      } else {
        const idx = list.indexOf('rc_mastery_guide');
        if (idx > -1) list.splice(idx, 1);
      }
      
      await AsyncStorage.setItem('rc_bookmarks', JSON.stringify(list));
      setIsBookmarked(!isBookmarked);
    } catch (error) {
      console.log('Bookmark error:', error);
    }
  };

  const toggle = (i) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setOpenIndex(openIndex === i ? null : i);
  };

  const markStepComplete = async (stepId) => {
    const newCompleted = new Set([...completedSteps, stepId]);
    setCompletedSteps(newCompleted);
    
    await AsyncStorage.setItem('rc_progress', JSON.stringify({
      completed: [...newCompleted],
      watchedVideo,
    }));
  };

  const handleStartQuiz = () => {
    if (completedSteps.size < COURSE_CONTENT.length) {
      Alert.alert(
        'Complete the course',
        'Please complete all sections before starting the quiz.',
        [{ text: 'OK' }]
      );
      return;
    }
    
    // navigation.navigate('RCQuiz');
    alert('Quiz feature coming soon!');
  };

  const handlePlayVideo = () => {
    // TODO: Implement video player
    alert('Video player coming soon!');
  };

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: scale(140) }}
      >
        {/* HEADER */}
        <View style={styles.header}>
          <TouchableOpacity 
            onPress={() => navigation.goBack()}
            activeOpacity={0.7}
          >
            <Icon name="arrow-back" size={24} color="#1F3B1F" />
          </TouchableOpacity>
          
          <Text style={styles.headerTitle}>RC Mastery Guide</Text>
          
          <TouchableOpacity 
            onPress={handleBookmark}
            activeOpacity={0.7}
          >
            <Icon 
              name={isBookmarked ? "bookmark" : "bookmark-outline"} 
              size={24} 
              color="#1F3B1F" 
            />
          </TouchableOpacity>
        </View>

        {/* PROGRESS */}
        <View style={styles.progressWrap}>
          <Text style={styles.progressLabel}>COURSE PROGRESS</Text>
          <Text style={styles.progressPercent}>{progress}% Complete</Text>
        </View>

        <View style={styles.progressBar}>
          <View style={[styles.progressFill, { width: `${progress}%` }]} />
        </View>

        {/* VIDEO CARD */}
        <TouchableOpacity 
          style={styles.videoCard}
          onPress={handlePlayVideo}
          activeOpacity={0.9}
        >
          <View style={styles.playBtn}>
            <Icon name="play" size={28} color="#F9FAF6" />
          </View>

          <View style={styles.videoBottom}>
            <Text style={styles.videoTitle}>
              RC Strategy: The Skimming & Scanning Method
            </Text>
            <Text style={styles.videoTime}>⏱ 12:45 • 👁 2.4K views</Text>
          </View>

          {watchedVideo && (
            <View style={styles.watchedBadge}>
              <Icon name="checkmark-circle" size={16} color="#10B981" />
              <Text style={styles.watchedText}>Watched</Text>
            </View>
          )}
        </TouchableOpacity>

        {/* FRAMEWORK */}
        <Text style={styles.sectionTitle}>📘 Strategic Framework</Text>

        {COURSE_CONTENT.map((item, index) => (
          <TouchableOpacity
            key={item.id}
            activeOpacity={0.85}
            style={styles.accordion}
            onPress={() => toggle(index)}
          >
            <View style={styles.accordionHeader}>
              <View style={[
                styles.step,
                completedSteps.has(item.id) && styles.stepCompleted
              ]}>
                {completedSteps.has(item.id) ? (
                  <Icon name="checkmark" size={16} color="#FFFFFF" />
                ) : (
                  <Text style={styles.stepText}>{item.id}</Text>
                )}
              </View>
              
              <Text style={styles.accordionTitle}>{item.title}</Text>
              
              <Icon 
                name={openIndex === index ? "chevron-up" : "chevron-down"} 
                size={20} 
                color="#1F3B1F" 
              />
            </View>

            {openIndex === index && (
              <View style={styles.accordionBody}>
                {item.bullets.map((bullet, i) => (
                  <Text key={i} style={styles.bullet}>• {bullet}</Text>
                ))}

                <View style={styles.tipBox}>
                  <Text style={styles.tipTitle}>💡 PRO TIP</Text>
                  <Text style={styles.tipText}>{item.tip}</Text>
                </View>

                {!completedSteps.has(item.id) ? (
                  <TouchableOpacity 
                    style={styles.markCompleteBtn}
                    onPress={() => markStepComplete(item.id)}
                    activeOpacity={0.8}
                  >
                    <Text style={styles.markCompleteText}>✓ Mark as Complete</Text>
                  </TouchableOpacity>
                ) : (
                  <View style={styles.completedBadge}>
                    <Icon name="checkmark-circle" size={16} color="#10B981" />
                    <Text style={styles.completedText}>Completed</Text>
                  </View>
                )}
              </View>
            )}
          </TouchableOpacity>
        ))}

        {/* INTERACTIVE EXAMPLE */}
        <Text style={styles.sectionTitle}>🧠 Interactive Example</Text>

        <View style={styles.passageCard}>
          <Text style={styles.passage}>
            The digitalization of education has promised democratized access
            for all.{" "}
            <Text style={styles.highlightBlue}>However</Text>, the reality
            reflects a stark digital divide.{" "}
            <Text style={styles.highlightYellow}>This suggests</Text> that
            technology alone is not a panacea.
          </Text>
        </View>

        <View style={styles.infoBlue}>
          <Text style={styles.infoTitle}>
            Structural Pivot: "However"
          </Text>
          <Text style={styles.infoText}>
            Indicates a shift from a positive belief to critical evaluation.
          </Text>
        </View>

        <View style={styles.infoYellow}>
          <Text style={styles.infoTitle}>
            Inference Marker: "This suggests"
          </Text>
          <Text style={styles.infoText}>
            Signals the author's central argument or conclusion.
          </Text>
        </View>
      </ScrollView>

      {/* CTA */}
      <View style={styles.bottomBar}>
        <TouchableOpacity 
          activeOpacity={0.9} 
          style={[
            styles.cta,
            completedSteps.size < COURSE_CONTENT.length && styles.ctaDisabled
          ]}
          onPress={handleStartQuiz}
        >
          <Text style={styles.ctaText}>
            {completedSteps.size < COURSE_CONTENT.length 
              ? `Complete ${COURSE_CONTENT.length - completedSteps.size} more sections` 
              : 'Start Practice Quiz →'}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default RCLearningScreen;

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: "#F9FAF6",
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: scale(16),
    alignItems: "center",
    paddingTop: Platform.OS === 'ios' ? scale(10) : scale(40),
  },

  headerTitle: {
    fontSize: scale(17),
    fontWeight: "800",
    color: "#1F3B1F",
    flex: 1,
    textAlign: 'center',
  },

  progressWrap: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: scale(16),
    marginTop: 4,
  },

  progressLabel: {
    fontSize: scale(11),
    fontWeight: "700",
    color: "#1F3B1F",
    letterSpacing: 0.5,
  },

  progressPercent: {
    fontSize: scale(11),
    fontWeight: "700",
    color: "#1F3B1F",
  },

  progressBar: {
    height: 6,
    backgroundColor: "#DDE8E1",
    marginHorizontal: scale(16),
    borderRadius: 6,
    marginTop: 8,
    overflow: 'hidden',
  },

  progressFill: {
    height: "100%",
    backgroundColor: "#1F3B1F",
    borderRadius: 6,
  },

  videoCard: {
    height: 200,
    backgroundColor: "#0F1A13",
    borderRadius: 20,
    margin: scale(16),
    justifyContent: "center",
    alignItems: "center",
    overflow: 'hidden',
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
      },
      android: {
        elevation: 8,
      },
    }),
  },

  playBtn: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "#10B981",
    justifyContent: "center",
    alignItems: "center",
  },

  videoBottom: {
    position: "absolute",
    bottom: 14,
    left: 14,
    right: 14,
  },

  videoTitle: {
    color: "#F9FAF6",
    fontSize: 14,
    fontWeight: "700",
    lineHeight: 20,
  },

  videoTime: {
    color: "#D1D5DB",
    fontSize: 11,
    marginTop: 4,
  },

  watchedBadge: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: '#ECFDF5',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },

  watchedText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#1F3B1F',
  },

  sectionTitle: {
    fontSize: scale(16),
    fontWeight: "800",
    marginHorizontal: scale(16),
    marginTop: scale(26),
    marginBottom: scale(4),
    color: "#1F3B1F",
  },

  accordion: {
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    marginHorizontal: scale(16),
    marginTop: 12,
    padding: 16,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 4,
      },
      android: {
        elevation: 3,
      },
    }),
  },

  accordionHeader: {
    flexDirection: "row",
    alignItems: "center",
  },

  step: {
    backgroundColor: "#E9F2EC",
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },

  stepCompleted: {
    backgroundColor: "#1F3B1F",
  },

  stepText: {
    fontWeight: "700",
    color: "#1F3B1F",
    fontSize: 14,
  },

  accordionTitle: {
    flex: 1,
    marginLeft: 12,
    fontWeight: "700",
    color: "#1F3B1F",
    fontSize: 15,
  },

  accordionBody: {
    marginTop: 16,
  },

  bullet: {
    fontSize: 13,
    marginBottom: 8,
    lineHeight: 20,
    color: "#374151",
  },

  tipBox: {
    backgroundColor: "#FEF3C7",
    padding: 14,
    borderRadius: 12,
    marginTop: 12,
    borderWidth: 1,
    borderColor: '#FDE68A',
  },

  tipTitle: {
    fontWeight: "700",
    fontSize: 12,
    color: "#92400E",
  },

  tipText: {
    fontSize: 12,
    marginTop: 6,
    lineHeight: 18,
    color: "#78350F",
  },

  markCompleteBtn: {
    backgroundColor: '#10B981',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 14,
  },

  markCompleteText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },

  completedBadge: {
    backgroundColor: '#ECFDF5',
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 14,
    borderWidth: 1,
    borderColor: '#D1FAE5',
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 6,
  },

  completedText: {
    color: '#10B981',
    fontSize: 13,
    fontWeight: '700',
  },

  passageCard: {
    backgroundColor: "#FFFFFF",
    margin: scale(16),
    padding: 16,
    borderRadius: 18,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 4,
      },
      android: {
        elevation: 3,
      },
    }),
  },

  passage: {
    fontSize: 14,
    lineHeight: 24,
    color: "#111827",
  },

  highlightBlue: {
    backgroundColor: "#DDE8E1",
    fontWeight: "800",
    color: "#1F3B1F",
    paddingHorizontal: 4,
  },

  highlightYellow: {
    backgroundColor: "#F3EED9",
    fontWeight: "800",
    color: "#1F3B1F",
    paddingHorizontal: 4,
  },

  infoBlue: {
    backgroundColor: "#E9F2EC",
    marginHorizontal: scale(16),
    padding: 14,
    borderRadius: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#D1E7DD',
  },

  infoYellow: {
    backgroundColor: "#F6F3E6",
    marginHorizontal: scale(16),
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#F3EED9',
  },

  infoTitle: {
    fontWeight: "700",
    fontSize: 13,
    color: "#1F3B1F",
    marginBottom: 4,
  },

  infoText: {
    fontSize: 12,
    lineHeight: 18,
    color: "#374151",
  },

  bottomBar: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
    paddingBottom: Platform.OS === 'ios' ? 24 : 16,
    backgroundColor: "#F9FAF6",
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

  cta: {
    backgroundColor: "#1F3B1F",
    paddingVertical: 16,
    borderRadius: 18,
    alignItems: "center",
  },

  ctaDisabled: {
    backgroundColor: "#9CA3AF",
  },

  ctaText: {
    color: "#F9FAF6",
    fontSize: 15,
    fontWeight: "800",
  },
});