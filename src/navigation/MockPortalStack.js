import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import TestScreen from "../screens/MockPortal/TestsScreen"

import MockDetailsScreen from "../screens/MockPortal/MockDetailsScreen";
import TestInterfaceScreen from "../screens/MockPortal/TestInterfaceScreen";
import ResultScreen from "../screens/MockPortal/ResultScreen";
import AnalyticsScreen from "../screens/MockPortal/AnalyticsScreen";
import SolutionScreen from "../screens/MockPortal/SolutionScreen";


const stack = createNativeStackNavigator();

const MockPortalStack = () => {
    return(
        <stack.Navigator screenOptions={{headerShown:false}}>
            {/* Top Tabs */}
            <stack.Screen name="TestMain" component={TestScreen}/>

            {/* Normal Test Flow */}
            <stack.Screen name="MockDetail" component={MockDetailsScreen}/>
            <stack.Screen name="TestInterface" component={TestInterfaceScreen}/>
            <stack.Screen name="Result" component={ResultScreen}/>
            <stack.Screen name="Analytics" component={AnalyticsScreen}/>
            <stack.Screen name="solution" component={SolutionScreen}/>
        </stack.Navigator>
    );
};
 export default MockPortalStack;