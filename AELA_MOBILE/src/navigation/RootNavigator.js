import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "../theme/colors";

import WelcomeScreen from "../screens/WelcomeScreen";
import SignInScreen from "../screens/SignInScreen";
import SignUpScreen from "../screens/SignUpScreen";
import DashboardScreen from "../screens/DashboardScreen";
import FitnessScreen from "../screens/FitnessScreen";
import AcompanhamentoScreen from "../screens/AcompanhamentoScreen";
import PerfilScreen from "../screens/PerfilScreen";
import OperadorDetailScreen from "../screens/OperadorDetailScreen";
import BodyScreen from "../screens/BodyScreen";
import HeartScreen from "../screens/HeartScreen";
import MentalScreen from "../screens/MentalScreen";
import SystemDetailScreen from "../screens/SystemDetailScreen";

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function Tabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: {
          backgroundColor: colors.bgSoft, borderTopColor: colors.border,
          height: 64, paddingBottom: 8, paddingTop: 8,
        },
        tabBarActiveTintColor: colors.pink,
        tabBarInactiveTintColor: colors.textFaint,
        tabBarLabelStyle: { fontSize: 11, fontWeight: "600" },
        tabBarIcon: ({ color, size }) => {
          const m = { Dashboard: "grid", Fitness: "barbell", Acompanhamento: "pulse", Perfil: "person" };
          return <Ionicons name={m[route.name]} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Dashboard" component={DashboardScreen} />
      <Tab.Screen name="Fitness" component={FitnessScreen} />
      <Tab.Screen name="Acompanhamento" component={AcompanhamentoScreen} />
      <Tab.Screen name="Perfil" component={PerfilScreen} />
    </Tab.Navigator>
  );
}

export default function RootNavigator({ isAuthed }) {
  return (
    <Stack.Navigator
      initialRouteName={isAuthed ? "Tabs" : "Welcome"}
      screenOptions={{ headerShown: false, contentStyle: { backgroundColor: colors.bg } }}
    >
      {!isAuthed ? (
        <>
          <Stack.Screen name="Welcome" component={WelcomeScreen} />
          <Stack.Screen name="SignIn" component={SignInScreen} />
          <Stack.Screen name="SignUp" component={SignUpScreen} />
        </>
      ) : (
        <>
          <Stack.Screen name="Tabs" component={Tabs} />
          <Stack.Screen name="OperadorDetail" component={OperadorDetailScreen} />
          <Stack.Screen name="Body" component={BodyScreen} />
          <Stack.Screen name="Heart" component={HeartScreen} />
          <Stack.Screen name="Mental" component={MentalScreen} />
          <Stack.Screen name="SystemDetail" component={SystemDetailScreen} />
        </>
      )}
    </Stack.Navigator>
  );
}
