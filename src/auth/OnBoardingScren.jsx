import React, { useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Dimensions,
  TouchableOpacity,
  StatusBar,
} from "react-native";

const { width } = Dimensions.get("window");

const slides = [
  {
    id: "1",
    title: "Learn Smarter",
    description:
      "Bite-sized lessons designed to improve your vocabulary and communication.",
  },
  {
    id: "2",
    title: "Practice Daily",
    description:
      "Daily exercises and challenges to build consistency and confidence.",
  },
  {
    id: "3",
    title: "Speak Better",
    description:
      "Real-world examples that help you speak fluent and correct English.",
  },
];

const OnboardingScreen = ({ navigation }) => {
  const flatListRef = useRef(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  const onViewableItemsChanged = useRef(({ viewableItems }) => {
    setCurrentIndex(viewableItems[0].index);
  }).current;

  const viewConfig = useRef({ viewAreaCoveragePercentThreshold: 50 }).current;

  const handleNext = () => {
    if (currentIndex < slides.length - 1) {
      flatListRef.current.scrollToIndex({
        index: currentIndex + 1,
      });
    } else {
      navigation.replace("Login");
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#F9FAF6" />

      {/* Skip */}
      <TouchableOpacity
        style={styles.skipButton}
        onPress={() => navigation.replace("Login")}
      >
        <Text style={styles.skipText}>Skip</Text>
      </TouchableOpacity>

      <FlatList
        ref={flatListRef}
        data={slides}
        keyExtractor={(item) => item.id}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={viewConfig}
        renderItem={({ item }) => (
          <View style={styles.slide}>
            {/* Illustration Placeholder */}
            <View style={styles.illustration} />

            <Text style={styles.title}>{item.title}</Text>
            <Text style={styles.description}>{item.description}</Text>
          </View>
        )}
      />

      {/* Pagination */}
      <View style={styles.pagination}>
        {slides.map((_, index) => (
          <View
            key={index}
            style={[
              styles.dot,
              currentIndex === index && styles.activeDot,
            ]}
          />
        ))}
      </View>

      {/* Next Button */}
      <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
        <Text style={styles.nextText}>
          {currentIndex === slides.length - 1 ? "Get Started" : "Next"}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default OnboardingScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9FAF6",
  },
  skipButton: {
    position: "absolute",
    top: 50,
    right: 20,
    zIndex: 10,
  },
  skipText: {
    color: "#6B7280",
    fontSize: 14,
  },
  slide: {
    width,
    alignItems: "center",
    paddingHorizontal: 30,
    marginTop: 120,
  },
  illustration: {
    height: 220,
    width: 220,
    borderRadius: 110,
    backgroundColor: "#E5EFE5", // placeholder
    marginBottom: 50,
  },
  title: {
    fontSize: 26,
    fontWeight: "700",
    color: "#1F3B1F",
    marginBottom: 12,
  },
  description: {
    fontSize: 15,
    color: "#6B7280",
    textAlign: "center",
    lineHeight: 22,
  },
  pagination: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 30,
  },
  dot: {
    height: 8,
    width: 8,
    borderRadius: 4,
    backgroundColor: "#D1D5DB",
    marginHorizontal: 5,
  },
  activeDot: {
    width: 18,
    backgroundColor: "#1F3B1F",
  },
  nextButton: {
    backgroundColor: "#1F3B1F",
    marginHorizontal: 30,
    paddingVertical: 16,
    borderRadius: 30,
    alignItems: "center",
    marginBottom: 40,
  },
  nextText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
});
