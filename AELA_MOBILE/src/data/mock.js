// Dados simulados (fallback quando a API Java nao esta disponivel)
import { IMG } from "./images";

// Operadoras (astronautas mulheres) — nomes dados as PESSOA_REF_ASTRONAUTA
export const OPERADORES = [
  {
    id: 1, nome: "Isabelle Dallabeneta", matricula: "AELA-001",
    email: "isabelle@aela.io", tipoAmbiente: "ESPACO",
    especialidade: "Comandante", ativo: true, possuiBaseline: true,
    foto: IMG.astro[0], atualizado: "ha 4 min", saude: "boa",
    bio: "Comandante da missao Aurora. Especialista em EVA.",
    metrics: { fc: 68, spo2: 98, sono: 7.5, cog: 86, reacao: 205, equilibrio: 89 },
    score: 92,
    dados: {
      pressao: "118/76", pressaoHistory: [116, 118, 118, 120, 117, 118],
      boneHistory: [91, 90, 89, 89, 88, 89, 89],
      calorias: "2.1k", caloriasHistory: [1900, 2100, 1950, 2200, 2050], caloriasMeta: [2000, 2000, 2000, 2000, 2000],
      hidratacao: 2.4, hidratacaoHistory: [2.2, 2.4, 2.1, 2.6, 2.3, 2.5, 2.4],
      sonoHistory: [7.2, 7.5, 7.1, 7.6, 7.3, 7.5],
      macros: { carb: 45, prot: 30, gord: 25 },
    },
  },
  {
    id: 2, nome: "Nicolli Amy", matricula: "AELA-002",
    email: "nicolli@aela.io", tipoAmbiente: "ESPACO",
    especialidade: "Tripulante", ativo: true, possuiBaseline: true,
    foto: IMG.astro[1], atualizado: "ha 12 min", saude: "media",
    bio: "Engenheira de bordo. Monitora suporte de vida.",
    metrics: { fc: 79, spo2: 96, sono: 6, cog: 74, reacao: 240, equilibrio: 80 },
    score: 71,
    dados: {
      pressao: "128/82", pressaoHistory: [126, 129, 128, 131, 127, 128],
      boneHistory: [84, 82, 81, 80, 81, 80, 80],
      calorias: "1.8k", caloriasHistory: [1700, 1850, 1800, 1900, 1800], caloriasMeta: [2000, 2000, 2000, 2000, 2000],
      hidratacao: 2.1, hidratacaoHistory: [1.9, 2.1, 2.0, 2.2, 2.0, 2.1, 2.1],
      sonoHistory: [5.5, 6.2, 5.8, 6.0, 6.1, 6.0],
      macros: { carb: 50, prot: 28, gord: 22 },
    },
  },
  {
    id: 3, nome: "Camila Pedroza", matricula: "AELA-003",
    email: "camila@aela.io", tipoAmbiente: "ESPACO",
    especialidade: "Astronauta", ativo: true, possuiBaseline: true,
    foto: IMG.astro[2], atualizado: "ha 1 h", saude: "boa",
    bio: "Medica da tripulacao. Cuida da saude coletiva.",
    metrics: { fc: 64, spo2: 99, sono: 8, cog: 90, reacao: 198, equilibrio: 93 },
    score: 95,
    dados: {
      pressao: "115/74", pressaoHistory: [113, 115, 114, 116, 115, 115],
      boneHistory: [94, 93, 93, 92, 93, 93, 93],
      calorias: "2.3k", caloriasHistory: [2100, 2300, 2200, 2400, 2300], caloriasMeta: [2000, 2000, 2000, 2000, 2000],
      hidratacao: 2.6, hidratacaoHistory: [2.4, 2.6, 2.5, 2.7, 2.6, 2.6, 2.6],
      sonoHistory: [7.8, 8.1, 7.9, 8.2, 8.0, 8.0],
      macros: { carb: 40, prot: 35, gord: 25 },
    },
  },
  {
    id: 4, nome: "Marina Vega", matricula: "AELA-004",
    email: "marina@aela.io", tipoAmbiente: "ESPACO",
    especialidade: "Analista", ativo: true, possuiBaseline: true,
    foto: IMG.astro[3], atualizado: "ha 2 h", saude: "ruim",
    bio: "Especialista em coleta de amostras em Marte.",
    metrics: { fc: 92, spo2: 93, sono: 4.5, cog: 61, reacao: 310, equilibrio: 68 },
    score: 47,
    dados: {
      pressao: "145/95", pressaoHistory: [140, 143, 145, 148, 146, 145],
      boneHistory: [74, 72, 70, 69, 68, 68, 68],
      calorias: "1.5k", caloriasHistory: [1400, 1500, 1450, 1600, 1500], caloriasMeta: [2000, 2000, 2000, 2000, 2000],
      hidratacao: 1.8, hidratacaoHistory: [1.5, 1.7, 1.6, 1.9, 1.8, 1.8, 1.8],
      sonoHistory: [5.0, 4.8, 4.5, 4.2, 4.5, 4.5],
      macros: { carb: 55, prot: 25, gord: 20 },
    },
  },
];

export const MISSOES = [
  { id: 1, nome: "Aurora EVA-7", descricao: "Caminhada extraveicular de manutencao", tipoAmbiente: "ESPACO", status: "EM_ANDAMENTO", totalTripulacao: 4 },
  { id: 2, nome: "Orbita Helios", descricao: "Monitoramento orbital de longa duracao", tipoAmbiente: "ESPACO", status: "PLANEJADA", totalTripulacao: 2 },
];

export const TIPOS_TAREFA = [
  { key: "EVA", label: "EVA / Spacewalk" },
  { key: "OPERACAO_COGNITIVA", label: "Precisao Cognitiva" },
  { key: "TAREFA_FISICA", label: "Esforco Fisico" },
  { key: "PILOTAGEM", label: "Pilotagem" },
  { key: "MONITORAMENTO", label: "Monitoramento" },
  { key: "RESGATE", label: "Resgate" },
];

// Aulas/treinos (aba fitness) — usam ELEMENTO_PESSOA
export const TREINOS = [
  { id: "t1", titulo: "Resistencia em Microgravidade", duracao: "32 min", kcal: 410, nivel: "Avancado", img: IMG.pessoa[0] },
  { id: "t2", titulo: "Mobilidade Articular", duracao: "18 min", kcal: 180, nivel: "Iniciante", img: IMG.pessoa[1] },
  { id: "t3", titulo: "Forca Funcional ATR", duracao: "45 min", kcal: 520, nivel: "Avancado", img: IMG.pessoa[2] },
  { id: "t4", titulo: "Recuperacao Ativa", duracao: "22 min", kcal: 150, nivel: "Intermediario", img: IMG.pessoa[3] },
];

// Kanban inicial (supervisor ve quem fez)
export const KANBAN_INICIAL = {
  todo: [
    { id: "k1", op: "Marina Vega", tarefa: "Forca Funcional ATR" },
    { id: "k2", op: "Nicolli Amy", tarefa: "Mobilidade Articular" },
  ],
  doing: [
    { id: "k3", op: "Isabelle D.", tarefa: "Resistencia em Microgravidade" },
  ],
  done: [
    { id: "k4", op: "Camila Pedroza", tarefa: "Recuperacao Ativa" },
  ],
};
