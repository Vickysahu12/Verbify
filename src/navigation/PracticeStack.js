// navigation/PracticeStack.js
import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import PracticeScreen from "../screens/practiceArea/PracticeScreen";
import VocabScreen from "../screens/practiceArea/vocab/VocabScreen";
import RcScreen from "../screens/practiceArea/RC/RcScreen";
import ArticleScreen from "../screens/practiceArea/Article/ArticleScreen";
import ArticleDetailScreen from "../screens/practiceArea/Article/ArticleDetailsScreen";
import VaScreen from "../screens/practiceArea/VA/VaScreen";

const Stack = createNativeStackNavigator();

const PracticeStack = () => {
  return (
   <Stack.Navigator screenOptions={{ headerShown: false }}>
   <Stack.Screen name="PracticeMain" component={PracticeScreen} />
   <Stack.Screen name="ArticleDetail" component={ArticleDetailScreen} />
   <Stack.Screen name="RCDetail" component={RCDetailScreen} />
   <Stack.Screen name="VADetail" component={VADetailScreen} />
</Stack.Navigator>

  );
};

export default PracticeStack;
