import Constants from "expo-constants";

const BASE =
  (Constants.expoConfig &&
    Constants.expoConfig.extra &&
    Constants.expoConfig.extra.apiBaseUrl) ||
  "http://localhost:8080";

export const API_BASE_URL = BASE;

// fetch com timeout — devolve {ok, data, error}
async function req(path, options = {}, timeout = 4000) {
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), timeout);
  try {
    const res = await fetch(BASE + path, {
      headers: { "Content-Type": "application/json" },
      signal: ctrl.signal,
      ...options,
    });
    const text = await res.text();
    const data = text ? JSON.parse(text) : null;
    if (!res.ok) {
      return { ok: false, error: (data && (data.mensagem || data.erro)) || "Erro " + res.status, data };
    }
    return { ok: true, data };
  } catch (e) {
    return { ok: false, error: "offline", offline: true };
  } finally {
    clearTimeout(t);
  }
}

export const api = {
  listarOperadores: () => req("/api/operadores"),
  detalharOperador: (id) => req("/api/operadores/" + id),
  criarOperador: (body) => req("/api/operadores", { method: "POST", body: JSON.stringify(body) }),
  registrarLeitura: (id, body) =>
    req("/api/operadores/" + id + "/leituras", { method: "POST", body: JSON.stringify(body) }),
  readiness: (id, tipoTarefa) =>
    req("/api/readiness/operadores/" + id + "?tipoTarefa=" + tipoTarefa),
  listarMissoes: () => req("/api/missoes"),
  health: () => req("/actuator/health", {}, 2500),
};
