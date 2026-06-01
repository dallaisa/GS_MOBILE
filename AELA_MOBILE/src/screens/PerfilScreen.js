import React from "react";
import { View, Text, StyleSheet, Pressable, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import * as Notifications from "expo-notifications";
import Button from "../components/Button";
import { colors, radius } from "../theme/colors";
import { API_BASE_URL } from "../services/api";
import { useAuth } from "../../App";

export default function PerfilScreen() {
  const { user, signOut } = useAuth();
  const notificar = async () => {
    const perm = await Notifications.requestPermissionsAsync();
    if (!perm.granted) { alert("Permissao de notificacao negada."); return; }
    await Notifications.scheduleNotificationAsync({
      content: { title: "AELA", body: "Lembrete: registre a leitura fisiologica da tripulacao." },
      trigger: { seconds: 2 },
    });
  };
  return (
    <SafeAreaView style={s.root} edges={["top"]}>
      <ScrollView contentContainerStyle={{ padding: 18 }}>
        <Text style={s.h1}>Perfil</Text>
        <View style={s.card}>
          <View style={s.avatar}><Ionicons name="person" size={34} color={colors.pink} /></View>
          <Text style={s.nome}>{(user && user.nome) || "Supervisora AELA"}</Text>
          <Text style={s.email}>{(user && user.email) || "supervisora@aela.io"}</Text>
        </View>

        <Pressable style={s.row} onPress={notificar}>
          <Ionicons name="notifications" size={20} color={colors.orange} />
          <Text style={s.rowTxt}>Testar notificacao local</Text>
          <Ionicons name="chevron-forward" size={18} color={colors.textFaint} />
        </Pressable>
        <View style={s.row}>
          <Ionicons name="server" size={20} color={colors.pink} />
          <Text style={s.rowTxt}>API: {API_BASE_URL}</Text>
        </View>

        <Button title="Sair" variant="outline" onPress={signOut} style={{ marginTop: 24 }} />
      </ScrollView>
    </SafeAreaView>
  );
}
const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.bg },
  h1: { color: colors.text, fontSize: 26, fontWeight: "700", marginBottom: 18 },
  card: { backgroundColor: colors.card, borderRadius: radius.lg, padding: 22, alignItems: "center", borderWidth: 1, borderColor: colors.border },
  avatar: { width: 80, height: 80, borderRadius: 40, backgroundColor: colors.cardSoft, alignItems: "center", justifyContent: "center" },
  nome: { color: colors.text, fontSize: 20, fontWeight: "700", marginTop: 12 },
  email: { color: colors.textDim, marginTop: 4 },
  row: { flexDirection: "row", alignItems: "center", gap: 12, backgroundColor: colors.card, borderRadius: radius.md, padding: 16, marginTop: 12, borderWidth: 1, borderColor: colors.border },
  rowTxt: { color: colors.text, flex: 1 },
});
