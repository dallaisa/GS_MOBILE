/*
 * Modelo preditivo leve (on-device) — "Como ele volta a Terra?"
 * Projecao individual de recuperacao por sistema: ossos, coracao, mental, ocular.
 *
 * Abordagem: regressao linear simples sobre o desvio atual em relacao ao
 * baseline + taxa de recuperacao tipica de cada sistema apos retorno a 1G.
 * (Versao Python/scikit equivalente esta documentada no README.)
 */

// taxa de recuperacao diaria (% do desvio recuperado por dia em 1G)
const TAXA = { coracao: 0.12, ossos: 0.04, mental: 0.09, ocular: 0.07 };
const LABEL = {
  coracao: "Sistema Cardiovascular",
  ossos: "Densidade Ossea / Muscular",
  mental: "Saude Mental / Cognicao",
  ocular: "Sistema Ocular (SANS)",
};

function desvio(baseline, atual) {
  if (!baseline) return 0;
  return Math.abs((atual - baseline) / baseline) * 100;
}

// recebe metrics (atuais) e baseline aproximado por sistema
export function preverRecuperacao(metrics) {
  const sistemas = {
    coracao: desvio(68, metrics.fc),
    ossos: desvio(90, metrics.equilibrio),
    mental: desvio(88, metrics.cog),
    ocular: desvio(7.5, metrics.sono), // proxy de recuperacao ocular ligada ao sono
  };

  return Object.keys(sistemas).map((k) => {
    const desvioAtual = Math.min(100, sistemas[k]);
    const taxa = TAXA[k];
    // dias para reduzir o desvio a < 5% (limiar de "recuperado")
    let dias = 0;
    let d = desvioAtual;
    while (d > 5 && dias < 365) {
      d = d * (1 - taxa);
      dias++;
    }
    const score = Math.max(0, Math.round(100 - desvioAtual));
    return {
      sistema: k,
      label: LABEL[k],
      desvio: Math.round(desvioAtual),
      diasRecuperacao: dias,
      score,
      status: score >= 80 ? "Otimo" : score >= 60 ? "Atencao" : "Critico",
    };
  });
}

export function projetar30dias(score) {
  // curva de recuperacao projetada (6 pontos) para grafico
  const pts = [];
  let v = score;
  for (let i = 0; i <= 5; i++) {
    pts.push(Math.min(100, Math.round(v)));
    v += (100 - v) * 0.28;
  }
  return pts;
}
