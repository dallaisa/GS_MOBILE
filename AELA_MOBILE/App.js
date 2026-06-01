import "react-native-gesture-handler";
import React, { useEffect, useState, createContext, useContext } from "react";
import { View, ActivityIndicator } from "react-native";
import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { NavigationContainer } from "@react-navigation/native";
import { loadUser, saveUser, clearUser } from "./src/services/storage";
import { colors } from "./src/theme/colors";
import RootNavigator from "./src/navigation/RootNavigator";

export const AuthContext = createContext(null);
export const useAuth = () => useContext(AuthContext);

const navTheme = {
  dark: true,
  colors: {
    primary: colors.pink, background: colors.bg, card: colors.bg,
    text: colors.text, border: colors.border, notification: colors.pink,
  },
};

export default function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUser().then((u) => { setUser(u); setLoading(false); });
  }, []);

  const ctx = {
    user,
    signIn: async (u) => { await saveUser(u); setUser(u); },
    signOut: async () => { await clearUser(); setUser(null); },
  };

  if (loading) {
    return (
      <View style={{ flex: 1, backgroundColor: colors.bg, justifyContent: "center" }}>
        <ActivityIndicator color={colors.pink} size="large" />
      </View>
    );
  }

  return (
    <SafeAreaProvider>
      <AuthContext.Provider value={ctx}>
        <NavigationContainer theme={navTheme}>
          <StatusBar style="light" />
          <RootNavigator isAuthed={!!user} />
        </NavigationContainer>
      </AuthContext.Provider>
    </SafeAreaProvider>
  );
}
