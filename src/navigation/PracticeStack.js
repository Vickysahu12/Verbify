import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import PracticeScreen from "../screens/practiceArea/PracticeScreen";

//
import VocabScreen from "../screens/practiceArea/vocab/VocabScreen";

// Article
import ArticleScreen from "../screens/practiceArea/Article/ArticleScreen";
import ArticleDetailScreen from "../screens/practiceArea/Article/ArticleDetailsScreen";

// RC
import RcScreen from "../screens/practiceArea/RC/RcScreen";

// VA
import VaScreen from "../screens/practiceArea/VA/VaScreen";
import ParaJumbleScreen from "../screens/practiceArea/VA/ParaJumblesScreen";

const Stack = createNativeStackNavigator();

const PracticeStack = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      
      {/* Top Tabs */}
      <Stack.Screen name="PracticeMain" component={PracticeScreen} />

      {/* Vocab Flow */}
      <Stack.Screen name="Vocab" component={VocabScreen}/>

      {/* ARTICLE FLOW */}
      <Stack.Screen name="Article" component={ArticleScreen} />
      <Stack.Screen name="ArticleDetail" component={ArticleDetailScreen} />

      {/* RC FLOW */}
      <Stack.Screen name="RC" component={RcScreen} />

      {/* VA FLOW */}
      <Stack.Screen name="VA" component={VaScreen} />
      <Stack.Screen name="ParaJumble" component={ParaJumbleScreen} />

    </Stack.Navigator>
  );
};

export default PracticeStack;
