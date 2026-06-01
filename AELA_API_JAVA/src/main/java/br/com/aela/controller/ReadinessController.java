package br.com.aela.controller;

import br.com.aela.dto.AelaDto;
import br.com.aela.model.TipoTarefa;
import br.com.aela.service.ReadinessService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * CONTROLLER: ReadinessController
 *
 * Endpoints do coração da AELA: o cálculo de prontidão operacional.
 *
 * ─── Protocolos HTTP ─────────────────────────────────────────────
 * GET é usado para cálculo porque:
 *   - O cálculo é idempotente (mesmos dados → mesmo resultado)
 *   - Não cria ou altera recursos no banco
 *   - Pode ser cacheado por proxies HTTP se necessário
 *
 * @RequestParam: parâmetro de query string (?tipoTarefa=EVA)
 *   Ex: GET /api/readiness/operadores/1?tipoTarefa=EVA
 */
@RestController
@RequestMapping("/api/readiness")
@RequiredArgsConstructor
@Slf4j
public class ReadinessController {

    private final ReadinessService readinessService;

    /**
     * GET /api/readiness/operadores/{operadorId}?tipoTarefa=EVA
     *
     * Retorna o ReadinessScore atual do operador para o tipo de tarefa informado.
     * Compara a ÚLTIMA leitura registrada com o baseline individual.
     */
    @GetMapping("/operadores/{operadorId}")
    public ResponseEntity<AelaDto.ReadinessScoreResponse> calcularScore(
            @PathVariable Long operadorId,
            @RequestParam(defaultValue = "EVA") TipoTarefa tipoTarefa) {

        log.info("[AELA] GET /api/readiness/operadores/{}?tipoTarefa={}", operadorId, tipoTarefa);
        return ResponseEntity.ok(readinessService.calcular(operadorId, tipoTarefa));
    }

    /**
     * GET /api/readiness/missoes/{missaoId}/ranking?tipoTarefa=EVA
     *
     * Retorna o ranking de prontidão de TODA a tripulação da missão
     * para o tipo de tarefa informado. Ordenado do mais apto ao menos apto.
     *
     * Este é o endpoint que responde à pergunta do comandante:
     * "Quem está mais apto para a EVA de amanhã?"
     */
    @GetMapping("/missoes/{missaoId}/ranking")
    public ResponseEntity<List<AelaDto.ReadinessScoreResponse>> rankingMissao(
            @PathVariable Long missaoId,
            @RequestParam(defaultValue = "EVA") TipoTarefa tipoTarefa) {

        log.info("[AELA] GET /api/readiness/missoes/{}/ranking?tipoTarefa={}", missaoId, tipoTarefa);
        return ResponseEntity.ok(readinessService.rankingMissao(missaoId, tipoTarefa));
    }
}
