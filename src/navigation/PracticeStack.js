import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import PracticeScreen from "../screens/practiceArea/PracticeScreen";

//
import VocabScreen from "../screens/practiceArea/vocab/VocabScreen";
import VocabLearningScreen from "../screens/practiceArea/vocab/VocabLearningScreen";

// Article
import ArticleScreen from "../screens/practiceArea/Article/ArticleScreen";
import ArticleDetailScreen from "../screens/practiceArea/Article/ArticleDetailsScreen";

// RC
import RcScreen from "../screens/practiceArea/RC/RcScreen";
import RcReadingScreen from "../screens/practiceArea/RC/RcReadingScreen";

// VA
import VaScreen from "../screens/practiceArea/VA/VaScreen";
import VaConcept from "../screens/practiceArea/VA/VaConcept";

const Stack = createNativeStackNavigator();

const PracticeStack = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      
      {/* Top Tabs */}
      <Stack.Screen name="PracticeMain" component={PracticeScreen} />

      {/* Vocab Flow */}
      <Stack.Screen name="Vocab" component={VocabScreen}/>
      <Stack.Screen name="VocabLearning" component={VocabLearningScreen}/>

      {/* ARTICLE FLOW */}
      <Stack.Screen name="Article" component={ArticleScreen} />
      <Stack.Screen name="ArticleDetail" component={ArticleDetailScreen} />

      {/* RC FLOW */}
      <Stack.Screen name="RC" component={RcScreen} />
      <Stack.Screen name="RcRead" component={RcReadingScreen}/>
      

      {/* VA FLOW */}
      <Stack.Screen name="VA" component={VaScreen} />
      <Stack.Screen name="VaConcept" component={VaConcept}/>

    </Stack.Navigator>
  );
};

export default PracticeStack;
