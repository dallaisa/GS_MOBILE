import AsyncStorage from "@react-native-async-storage/async-storage";

const K = { user: "@aela_user", kanban: "@aela_kanban" };

export async function saveUser(u) { await AsyncStorage.setItem(K.user, JSON.stringify(u)); }
export async function loadUser() {
  const v = await AsyncStorage.getItem(K.user);
  return v ? JSON.parse(v) : null;
}
export async function clearUser() { await AsyncStorage.removeItem(K.user); }

export async function saveKanban(b) { await AsyncStorage.setItem(K.kanban, JSON.stringify(b)); }
export async function loadKanban() {
  const v = await AsyncStorage.getItem(K.kanban);
  return v ? JSON.parse(v) : null;
}
