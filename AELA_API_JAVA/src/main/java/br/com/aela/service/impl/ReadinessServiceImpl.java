package br.com.aela.service.impl;

import br.com.aela.dto.AelaDto;
import br.com.aela.exception.AelaException;
import br.com.aela.model.*;
import br.com.aela.repository.*;
import br.com.aela.service.ReadinessService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;

/**
 * IMPLEMENTAÇÃO: ReadinessServiceImpl
 *
 * Este é o CORAÇÃO do sistema AELA.
 *
 * Calcula o ReadinessScore comparando a última leitura fisiológica
 * do operador com seu baseline individual.
 *
 * ─── Lógica de cálculo ───────────────────────────────────────────
 *
 * 1. Desvio de cada métrica:
 *    desvio = |leitura - baseline| / baseline * 100
 *    (desvio percentual absoluto em relação ao valor de referência)
 *
 * 2. Agrupamento em 5 sistemas fisiológicos:
 *    - Cardiovascular: FC + PA sistólica + PA diastólica
 *    - Sensoriomotor:  tempo de reação + equilíbrio
 *    - Ocular (SANS):  pressão ocular + acuidade visual
 *    - Cognitivo:      score cognitivo
 *    - Recuperação:    sono + saturação O2
 *
 * 3. Pesos por tipo de tarefa (programação procedural com switch):
 *    Cada TipoTarefa tem pesos diferentes para cada sistema.
 *    EVA = mais peso em sensoriomotor e cardiovascular.
 *    OPERACAO_COGNITIVA = mais peso em cognitivo e tempo de reação.
 *
 * 4. Score final:
 *    scoreGeral = 100 - (soma ponderada dos desvios médios por sistema)
 *    Limitado entre 0 e 100.
 *
 * 5. Classificação:
 *    >= 80: APTO
 *    60–79: MONITORAMENTO
 *    40–59: RESTRIÇÃO
 *    < 40:  INAPTO
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class ReadinessServiceImpl implements ReadinessService {

    private final OperadorRepository operadorRepository;
    private final BaselineRepository baselineRepository;
    private final LeituraFisiologicaRepository leituraRepository;
    private final MissaoRepository missaoRepository;

    // ── CALCULAR READINESS SCORE ─────────────────────────────────────
    @Override
    @Transactional(readOnly = true)
    public AelaDto.ReadinessScoreResponse calcular(Long operadorId, TipoTarefa tipoTarefa) {

        log.info("[AELA] Calculando ReadinessScore: operador={}, tarefa={}", operadorId, tipoTarefa);

        // Passo 1: buscar operador
        Operador operador = operadorRepository.findById(operadorId)
                .orElseThrow(() -> new AelaException.RecursoNaoEncontradoException("Operador", operadorId));

        // Passo 2: buscar baseline (obrigatório para o cálculo)
        Baseline baseline = baselineRepository.findByOperadorId(operadorId)
                .orElseThrow(() -> new AelaException.RegraDeNegocioException(
                    "Operador " + operador.getNome() + " não possui baseline registrado. " +
                    "O baseline é obrigatório para calcular o ReadinessScore."
                ));

        // Passo 3: buscar última leitura
        LeituraFisiologica leitura = leituraRepository
                .findFirstByOperadorIdOrderByDataLeituraDesc(operadorId)
                .orElseThrow(() -> new AelaException.RegraDeNegocioException(
                    "Operador " + operador.getNome() + " não possui leituras registradas. " +
                    "Registre ao menos uma leitura antes de solicitar o ReadinessScore."
                ));

        // Passo 4: calcular desvios por sistema
        double desvioCardiovascular = calcularDesvioCardiovascular(baseline, leitura);
        double desvioSensoriomotor  = calcularDesvioSensoriomotor(baseline, leitura);
        double desvioOcular         = calcularDesvioOcular(baseline, leitura);
        double desvioCognitivo      = calcularDesvioCognitivo(baseline, leitura);
        double desvioRecuperacao    = calcularDesvioRecuperacao(baseline, leitura);

        // Passo 5: calcular score com pesos por tipo de tarefa
        double[] pesos = getPesosPorTarefa(tipoTarefa);
        // pesos[0]=cardiovascular, [1]=sensoriomotor, [2]=ocular, [3]=cognitivo, [4]=recuperação

        double desvioTotalPonderado =
            (desvioCardiovascular * pesos[0]) +
            (desvioSensoriomotor  * pesos[1]) +
            (desvioOcular         * pesos[2]) +
            (desvioCognitivo      * pesos[3]) +
            (desvioRecuperacao    * pesos[4]);

        double scoreGeral = Math.max(0, Math.min(100, 100 - desvioTotalPonderado));

        // Passo 6: classificar e gerar recomendação
        String classificacao = classificar(scoreGeral);
        String recomendacao  = gerarRecomendacao(scoreGeral, tipoTarefa,
                                                  desvioCardiovascular, desvioCognitivo,
                                                  desvioOcular, operador.getNome());

        log.info("[AELA] Score calculado: {} → {} ({})", operador.getNome(), scoreGeral, classificacao);

        return AelaDto.ReadinessScoreResponse.builder()
                .operadorId(operadorId)
                .operadorNome(operador.getNome())
                .tipoTarefa(tipoTarefa.name() + " — " + tipoTarefa.getDescricao())
                .scoreGeral(arredondar(scoreGeral))
                .desvioCardiovascular(arredondar(desvioCardiovascular))
                .desvioSensoriomotor(arredondar(desvioSensoriomotor))
                .desvioOcular(arredondar(desvioOcular))
                .desvioCognitivo(arredondar(desvioCognitivo))
                .desvioRecuperacao(arredondar(desvioRecuperacao))
                .classificacao(classificacao)
                .recomendacao(recomendacao)
                .dataCalculo(LocalDateTime.now().toString())
                .build();
    }

    // ── RANKING DA MISSÃO ────────────────────────────────────────────
    @Override
    @Transactional(readOnly = true)
    public List<AelaDto.ReadinessScoreResponse> rankingMissao(Long missaoId, TipoTarefa tipoTarefa) {

        Missao missao = missaoRepository.findById(missaoId)
                .orElseThrow(() -> new AelaException.RecursoNaoEncontradoException("Missão", missaoId));

        if (missao.getTripulacao().isEmpty()) {
            throw new AelaException.RegraDeNegocioException(
                "A missão '" + missao.getNome() + "' não possui tripulação cadastrada."
            );
        }

        // Programação procedural com Stream:
        // 1. Para cada operador da tripulação, calcular o score
        // 2. Ignorar operadores sem baseline ou leitura (log de aviso)
        // 3. Ordenar do maior para o menor score (mais apto primeiro)
        return missao.getTripulacao().stream()
                .map(op -> {
                    try {
                        return calcular(op.getId(), tipoTarefa);
                    } catch (AelaException.RegraDeNegocioException e) {
                        log.warn("[AELA] Operador {} excluído do ranking: {}", op.getNome(), e.getMessage());
                        return null;
                    }
                })
                .filter(score -> score != null)
                .sorted(Comparator.comparingDouble(
                    AelaDto.ReadinessScoreResponse::getScoreGeral).reversed()
                )
                .collect(Collectors.toList());
    }

    // ════════════════════════════════════════════════════════════════
    // MÉTODOS AUXILIARES DE CÁLCULO — Programação procedural
    // ════════════════════════════════════════════════════════════════

    /**
     * Calcula desvio percentual absoluto médio do sistema cardiovascular.
     * Sistema cardiovascular: frequência cardíaca + PA sistólica + PA diastólica.
     */
    private double calcularDesvioCardiovascular(Baseline b, LeituraFisiologica l) {
        double desvioFC  = desvioPercentual(b.getFreqCardiacaBasal(), l.getFreqCardiaca());
        double desvioPAS = desvioPercentual(b.getPressaoSistolica(), l.getPressaoSistolica());
        double desvioPAD = desvioPercentual(b.getPressaoDiastolica(), l.getPressaoDiastolica());
        return (desvioFC + desvioPAS + desvioPAD) / 3.0;
    }

    /** Sistema sensoriomotor: tempo de reação + equilíbrio */
    private double calcularDesvioSensoriomotor(Baseline b, LeituraFisiologica l) {
        double desvioTR  = desvioPercentual(b.getTempoReacaoMs(), l.getTempoReacaoMs());
        double desvioEQ  = desvioPercentualInverso(b.getScoreEquilibrio(), l.getScoreEquilibrio());
        return (desvioTR + desvioEQ) / 2.0;
    }

    /** Sistema ocular (módulo SANS): pressão intraocular + acuidade visual */
    private double calcularDesvioOcular(Baseline b, LeituraFisiologica l) {
        double desvioPI  = desvioPercentual(b.getPressaoOcular(), l.getPressaoOcular());
        double desvioAV  = desvioPercentualInverso(b.getAcuidadeVisual(), l.getAcuidadeVisual());
        return (desvioPI + desvioAV) / 2.0;
    }

    /** Sistema cognitivo: score cognitivo */
    private double calcularDesvioCognitivo(Baseline b, LeituraFisiologica l) {
        return desvioPercentualInverso(b.getScoreCognitivo(), l.getScoreCognitivo());
    }

    /** Sistema de recuperação: horas de sono + saturação de O2 */
    private double calcularDesvioRecuperacao(Baseline b, LeituraFisiologica l) {
        double desvioSono = desvioPercentualInverso(b.getHorasSono(), l.getHorasSono());
        double desvioO2   = desvioPercentualInverso(b.getSaturacaoO2(), l.getSaturacaoO2());
        return (desvioSono + desvioO2) / 2.0;
    }

    /**
     * Desvio percentual: quanto a leitura se afastou do baseline.
     * Usado quando o aumento da métrica é negativo (ex: FC alta = ruim).
     */
    private double desvioPercentual(double baseline, double leitura) {
        if (baseline == 0) return 0;
        return Math.abs((leitura - baseline) / baseline) * 100;
    }

    /**
     * Desvio percentual inverso: queda é negativa.
     * Usado quando a QUEDA da métrica é ruim (ex: score cognitivo baixo = ruim).
     */
    private double desvioPercentualInverso(double baseline, double leitura) {
        if (baseline == 0) return 0;
        // Se leitura < baseline, há desvio. Se leitura >= baseline, desvio = 0.
        double diff = baseline - leitura;
        return Math.max(0, (diff / baseline) * 100);
    }

    /**
     * Pesos por tipo de tarefa — switch procedural explícito.
     * Retorna array: [cardiovascular, sensoriomotor, ocular, cognitivo, recuperação]
     * A soma dos pesos deve ser 1.0 (100%).
     */
    private double[] getPesosPorTarefa(TipoTarefa tarefa) {
        return switch (tarefa) {
            case EVA ->
                // EVA: maior risco sensoriomotor e cardiovascular
                new double[]{0.30, 0.30, 0.15, 0.15, 0.10};
            case OPERACAO_COGNITIVA ->
                // Precisão cognitiva: cognição e tempo de reação dominam
                new double[]{0.15, 0.20, 0.15, 0.35, 0.15};
            case TAREFA_FISICA ->
                // Esforço físico: cardiovascular e recuperação são críticos
                new double[]{0.35, 0.25, 0.10, 0.10, 0.20};
            case PILOTAGEM ->
                // Pilotagem: sensoriomotor + cognitivo + ocular
                new double[]{0.20, 0.25, 0.20, 0.25, 0.10};
            case MONITORAMENTO ->
                // Vigilância: cognitivo e visual + recuperação (fadiga)
                new double[]{0.15, 0.15, 0.25, 0.25, 0.20};
            case RESGATE ->
                // Resgate: tudo importa — pesos equilibrados
                new double[]{0.25, 0.25, 0.15, 0.20, 0.15};
        };
    }

    /** Classifica o score em categoria operacional */
    private String classificar(double score) {
        if (score >= 80) return "APTO";
        if (score >= 60) return "MONITORAMENTO";
        if (score >= 40) return "RESTRIÇÃO";
        return "INAPTO";
    }

    /**
     * Gera recomendação textual baseada no score e nos desvios dominantes.
     * Programação procedural: fluxo condicional em sequência lógica.
     */
    private String gerarRecomendacao(double score, TipoTarefa tarefa,
                                     double desvioCardio, double desvioCognitivo,
                                     double desvioOcular, String nomeOperador) {
        if (score >= 80) {
            return nomeOperador + " está apto para " + tarefa.getDescricao() + ". Nenhuma restrição identificada.";
        }

        StringBuilder rec = new StringBuilder();
        rec.append(nomeOperador).append(" — ");

        if (score >= 60) {
            rec.append("monitoramento recomendado. ");
        } else if (score >= 40) {
            rec.append("RESTRIÇÃO: evitar tarefas de alto risco. ");
        } else {
            rec.append("INAPTO: afastar do serviço ativo imediatamente. ");
        }

        // Identifica o sistema mais comprometido
        if (desvioCardio > 25) rec.append("Sistema cardiovascular em alerta. ");
        if (desvioCognitivo > 25) rec.append("Degradação cognitiva detectada — avaliar privação de sono. ");
        if (desvioOcular > 20) rec.append("Pressão ocular fora do baseline — verificar SANS. ");

        return rec.toString().trim();
    }

    /** Arredonda para 2 casas decimais */
    private double arredondar(double valor) {
        return Math.round(valor * 100.0) / 100.0;
    }
}
