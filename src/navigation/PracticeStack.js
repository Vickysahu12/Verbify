import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import PracticeScreen from "../screens/practiceArea/PracticeScreen";

//
import VocabScreen from "../screens/practiceArea/vocab/VocabScreen";
import VocabLearningScreen from "../screens/practiceArea/vocab/VocabLearningScreen";

// Article
import ArticleScreen from "../screens/practiceArea/Article/ArticleScreen";
import ArticleDetailScreen from "../screens/practiceArea/Article/ArticleDetailsScreen";
import ArticleReadScreen from "../screens/practiceArea/Article/ArticleReadScreen";

// RC
import RcScreen from "../screens/practiceArea/RC/RcScreen";
import RcReadingScreen from "../screens/practiceArea/RC/RcReadingScreen";

// VA
import VaScreen from "../screens/practiceArea/VA/VaScreen";
import VaConcept from "../screens/practiceArea/VA/VaHubScreen";
import ParajumbleScreen from "../screens/practiceArea/VA/ParaJumbleScreen";
import OddOneOutScreen from "../screens/practiceArea/VA/OddOneOutScreen";
import ParaSummaryScreen from "../screens/practiceArea/VA/ParaSummaryScreen";

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
      <Stack.Screen name="ArticleRead" component={ArticleReadScreen}/>

      {/* RC FLOW */}
      <Stack.Screen name="RC" component={RcScreen} />
      <Stack.Screen name="RcRead" component={RcReadingScreen}/>
      

      {/* VA FLOW */}
      <Stack.Screen name="VA" component={VaScreen} />
      <Stack.Screen name="VaConcept" component={VaConcept}/>
      <Stack.Screen name="Parajumble" component={ParajumbleScreen}/>
      <Stack.Screen name="OddOne" component={OddOneOutScreen}/>
      <Stack.Screen name="Parasum" component={ParaSummaryScreen}/>

    </Stack.Navigator>
  );
};

export default PracticeStack;
