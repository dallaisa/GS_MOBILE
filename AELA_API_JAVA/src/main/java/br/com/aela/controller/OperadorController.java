package br.com.aela.controller;

import br.com.aela.dto.AelaDto;
import br.com.aela.model.TipoTarefa;
import br.com.aela.service.BaselineService;
import br.com.aela.service.LeituraService;
import br.com.aela.service.OperadorService;
import br.com.aela.service.ReadinessService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/operadores")
@RequiredArgsConstructor
@Slf4j
public class OperadorController {

    private final OperadorService operadorService;
    private final BaselineService baselineService;
    private final LeituraService leituraService;

    // ════════════════════════════════════════════════════════════
    // OPERADORES — CRUD
    // ════════════════════════════════════════════════════════════

    /**
     * POST /api/operadores
     * Cadastra novo operador na plataforma AELA.
     *
     * HTTP 201 Created: recurso foi criado com sucesso.
     * @Valid: dispara validações do Bean Validation antes de entrar no método.
     */
    @PostMapping
    public ResponseEntity<AelaDto.OperadorResponse> cadastrar(
            @Valid @RequestBody AelaDto.OperadorRequest request) {

        log.info("[AELA] POST /api/operadores — {}", request.getEmail());
        AelaDto.OperadorResponse response = operadorService.cadastrar(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    /**
     * GET /api/operadores/{id}
     * Busca operador por ID
     */
    @GetMapping("/{id}")
    public ResponseEntity<AelaDto.OperadorResponse> buscarPorId(@PathVariable Long id) {

        log.info("[AELA] GET /api/operadores/{}", id);
        return ResponseEntity.ok(operadorService.buscarPorId(id));
    }

    /**
     * GET /api/operadores
     * Lista todos os operadores ativos.
     */
    @GetMapping
    public ResponseEntity<List<AelaDto.OperadorResponse>> listarAtivos() {

        log.info("[AELA] GET /api/operadores");
        return ResponseEntity.ok(operadorService.listarAtivos());
    }

    /**
     * PUT /api/operadores/{id}
     * Atualiza dados cadastrais.
     */
    @PutMapping("/{id}")
    public ResponseEntity<AelaDto.OperadorResponse> atualizar(
            @PathVariable Long id,
            @Valid @RequestBody AelaDto.OperadorRequest request) {

        log.info("[AELA] PUT /api/operadores/{}", id);
        return ResponseEntity.ok(operadorService.atualizar(id, request));
    }

    /**
     * DELETE /api/operadores/{id}
     * Desativa operador (soft delete — dados preservados no banco).
     *
     * HTTP 204 No Content: operação realizada, sem corpo de resposta.
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> desativar(@PathVariable Long id) {

        log.info("[AELA] DELETE /api/operadores/{}", id);
        operadorService.desativar(id);
        return ResponseEntity.noContent().build();
    }

    // ════════════════════════════════════════════════════════════
    // BASELINE — sub-recurso do operador
    // ════════════════════════════════════════════════════════════

    /**
     * POST /api/operadores/{id}/baseline
     * Registra ou atualiza o baseline fisiológico do operador.
     *
     * URL aninhada (sub-recurso): o baseline pertence ao operador.
     * Permite POST idempotente: se já existe, atualiza.
     */
    @PostMapping("/{id}/baseline")
    public ResponseEntity<AelaDto.BaselineResponse> registrarBaseline(
            @PathVariable Long id,
            @Valid @RequestBody AelaDto.BaselineRequest request) {

        log.info("[AELA] POST /api/operadores/{}/baseline", id);
        AelaDto.BaselineResponse response = baselineService.registrar(id, request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    /**
     * GET /api/operadores/{id}/baseline
     * Consulta o baseline do operador.
     */
    @GetMapping("/{id}/baseline")
    public ResponseEntity<AelaDto.BaselineResponse> consultarBaseline(@PathVariable Long id) {

        log.info("[AELA] GET /api/operadores/{}/baseline", id);
        return ResponseEntity.ok(baselineService.buscarPorOperador(id));
    }

    // ════════════════════════════════════════════════════════════
    // LEITURAS FISIOLÓGICAS — sub-recurso do operador
    // ════════════════════════════════════════════════════════════

    /**
     * POST /api/operadores/{id}/leituras
     * Registra nova leitura fisiológica (wearable, câmera, manual).
     */
    @PostMapping("/{id}/leituras")
    public ResponseEntity<AelaDto.LeituraRequest> registrarLeitura(
            @PathVariable Long id,
            @Valid @RequestBody AelaDto.LeituraRequest request) {

        log.info("[AELA] POST /api/operadores/{}/leituras — fonte: {}", id, request.getFonte());
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(leituraService.registrar(id, request));
    }

    /**
     * GET /api/operadores/{id}/leituras
     * Histórico de leituras do operador (mais recente primeiro).
     */
    @GetMapping("/{id}/leituras")
    public ResponseEntity<List<AelaDto.LeituraRequest>> listarLeituras(@PathVariable Long id) {

        log.info("[AELA] GET /api/operadores/{}/leituras", id);
        return ResponseEntity.ok(leituraService.listarPorOperador(id));
    }
}
