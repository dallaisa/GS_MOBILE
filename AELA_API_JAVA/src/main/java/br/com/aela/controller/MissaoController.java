package br.com.aela.controller;

import br.com.aela.dto.AelaDto;
import br.com.aela.exception.AelaException;
import br.com.aela.model.Missao;
import br.com.aela.model.Operador;
import br.com.aela.repository.MissaoRepository;
import br.com.aela.repository.OperadorRepository;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

/**
 * CONTROLLER: MissaoController
 *
 * Gestão de missões e tripulação.
 *
 * Nota: para simplificar, a lógica de missão está diretamente no controller
 * usando os repositórios. Em projetos maiores, extraia para MissaoService.
 */
@RestController
@RequestMapping("/api/missoes")
@RequiredArgsConstructor
@Slf4j
public class MissaoController {

    private final MissaoRepository missaoRepository;
    private final OperadorRepository operadorRepository;

    /** POST /api/missoes — Cria nova missão */
    @PostMapping
    @Transactional
    public ResponseEntity<AelaDto.MissaoResponse> criar(
            @Valid @RequestBody AelaDto.MissaoRequest request) {

        Missao missao = Missao.builder()
                .nome(request.getNome())
                .descricao(request.getDescricao())
                .tipoAmbiente(request.getTipoAmbiente())
                .status("PLANEJADA")
                .build();

        Missao salva = missaoRepository.save(missao);
        log.info("[AELA] Missão criada: {} (ID: {})", salva.getNome(), salva.getId());
        return ResponseEntity.status(HttpStatus.CREATED).body(toResponse(salva));
    }

    /** GET /api/missoes — Lista todas as missões */
    @GetMapping
    public ResponseEntity<List<AelaDto.MissaoResponse>> listar() {
        return ResponseEntity.ok(
            missaoRepository.findAll().stream()
                .map(this::toResponse)
                .collect(Collectors.toList())
        );
    }

    /** GET /api/missoes/{id} — Detalha uma missão */
    @GetMapping("/{id}")
    public ResponseEntity<AelaDto.MissaoResponse> buscar(@PathVariable Long id) {
        Missao missao = missaoRepository.findById(id)
                .orElseThrow(() -> new AelaException.RecursoNaoEncontradoException("Missão", id));
        return ResponseEntity.ok(toResponse(missao));
    }

    /**
     * POST /api/missoes/{id}/tripulacao/{operadorId}
     * Adiciona um operador à tripulação da missão.
     */
    @PostMapping("/{id}/tripulacao/{operadorId}")
    @Transactional
    public ResponseEntity<AelaDto.MissaoResponse> adicionarTripulante(
            @PathVariable Long id,
            @PathVariable Long operadorId) {

        Missao missao = missaoRepository.findById(id)
                .orElseThrow(() -> new AelaException.RecursoNaoEncontradoException("Missão", id));

        Operador operador = operadorRepository.findById(operadorId)
                .orElseThrow(() -> new AelaException.RecursoNaoEncontradoException("Operador", operadorId));

        // Verifica se já está na tripulação
        boolean jaEstaNaTripulacao = missao.getTripulacao().stream()
                .anyMatch(o -> o.getId().equals(operadorId));

        if (jaEstaNaTripulacao) {
            throw new AelaException.RegraDeNegocioException(
                operador.getNome() + " já está na tripulação da missão " + missao.getNome()
            );
        }

        missao.getTripulacao().add(operador);
        missaoRepository.save(missao);

        log.info("[AELA] {} adicionado à tripulação de {}", operador.getNome(), missao.getNome());
        return ResponseEntity.ok(toResponse(missao));
    }

    /**
     * PATCH /api/missoes/{id}/iniciar
     * Inicia a missão — muda status para EM_ANDAMENTO e registra dataInicio.
     */
    @PatchMapping("/{id}/iniciar")
    @Transactional
    public ResponseEntity<AelaDto.MissaoResponse> iniciar(@PathVariable Long id) {

        Missao missao = missaoRepository.findById(id)
                .orElseThrow(() -> new AelaException.RecursoNaoEncontradoException("Missão", id));

        if (!"PLANEJADA".equals(missao.getStatus())) {
            throw new AelaException.RegraDeNegocioException(
                "Apenas missões com status PLANEJADA podem ser iniciadas. Status atual: " + missao.getStatus()
            );
        }

        missao.setStatus("EM_ANDAMENTO");
        missao.setDataInicio(LocalDateTime.now());
        missaoRepository.save(missao);

        log.info("[AELA] Missão {} iniciada em {}", missao.getNome(), missao.getDataInicio());
        return ResponseEntity.ok(toResponse(missao));
    }

    /**
     * PATCH /api/missoes/{id}/encerrar
     * Encerra a missão — inicia fase de acompanhamento pós-missão.
     */
    @PatchMapping("/{id}/encerrar")
    @Transactional
    public ResponseEntity<AelaDto.MissaoResponse> encerrar(@PathVariable Long id) {

        Missao missao = missaoRepository.findById(id)
                .orElseThrow(() -> new AelaException.RecursoNaoEncontradoException("Missão", id));

        missao.setStatus("CONCLUIDA");
        missao.setDataFim(LocalDateTime.now());
        missaoRepository.save(missao);

        log.info("[AELA] Missão {} concluída. Iniciando fase pós-missão.", missao.getNome());
        return ResponseEntity.ok(toResponse(missao));
    }

    // ── Helper ───────────────────────────────────────────────────────
    private AelaDto.MissaoResponse toResponse(Missao m) {
        return AelaDto.MissaoResponse.builder()
                .id(m.getId())
                .nome(m.getNome())
                .descricao(m.getDescricao())
                .tipoAmbiente(m.getTipoAmbiente())
                .status(m.getStatus())
                .totalTripulacao(m.getTripulacao() != null ? m.getTripulacao().size() : 0)
                .dataInicio(m.getDataInicio() != null ? m.getDataInicio().toString() : null)
                .dataFim(m.getDataFim() != null ? m.getDataFim().toString() : null)
                .dataCadastro(m.getDataCadastro() != null ? m.getDataCadastro().toString() : null)
                .build();
    }
}
