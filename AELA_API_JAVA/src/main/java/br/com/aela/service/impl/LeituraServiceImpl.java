package br.com.aela.service.impl;

import br.com.aela.dto.AelaDto;
import br.com.aela.exception.AelaException;
import br.com.aela.model.LeituraFisiologica;
import br.com.aela.model.Missao;
import br.com.aela.model.Operador;
import br.com.aela.repository.BaselineRepository;
import br.com.aela.repository.LeituraFisiologicaRepository;
import br.com.aela.repository.MissaoRepository;
import br.com.aela.repository.OperadorRepository;
import br.com.aela.service.LeituraService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class LeituraServiceImpl implements LeituraService {

    private final LeituraFisiologicaRepository leituraRepository;
    private final OperadorRepository operadorRepository;
    private final BaselineRepository baselineRepository;
    private final MissaoRepository missaoRepository;

    @Override
    @Transactional
    public AelaDto.LeituraRequest registrar(Long operadorId, AelaDto.LeituraRequest request) {

        log.info("[AELA] Registrando leitura para operador ID: {}", operadorId);

        // Regra de negócio: operador deve existir e estar ativo
        Operador operador = operadorRepository.findById(operadorId)
                .orElseThrow(() -> new AelaException.RecursoNaoEncontradoException("Operador", operadorId));

        if (!operador.getAtivo()) {
            throw new AelaException.RegraDeNegocioException(
                "Operador " + operador.getNome() + " está inativo. Reative-o antes de registrar leituras."
            );
        }

        // Regra de negócio: operador deve ter baseline (AELA exige comparação com referência)
        if (!baselineRepository.existsByOperadorId(operadorId)) {
            throw new AelaException.RegraDeNegocioException(
                "Operador " + operador.getNome() + " não possui baseline. " +
                "Registre o baseline em POST /api/operadores/" + operadorId + "/baseline"
            );
        }

        // Missão é opcional — leitura pode ser pré ou pós-missão
        Missao missao = null;
        if (request.getMissaoId() != null) {
            missao = missaoRepository.findById(request.getMissaoId())
                    .orElseThrow(() -> new AelaException.RecursoNaoEncontradoException(
                        "Missão", request.getMissaoId()
                    ));
        }

        LeituraFisiologica leitura = LeituraFisiologica.builder()
                .operador(operador)
                .missao(missao)
                .freqCardiaca(request.getFreqCardiaca())
                .pressaoSistolica(request.getPressaoSistolica())
                .pressaoDiastolica(request.getPressaoDiastolica())
                .tempoReacaoMs(request.getTempoReacaoMs())
                .scoreEquilibrio(request.getScoreEquilibrio())
                .pressaoOcular(request.getPressaoOcular())
                .acuidadeVisual(request.getAcuidadeVisual())
                .scoreCognitivo(request.getScoreCognitivo())
                .horasSono(request.getHorasSono())
                .saturacaoO2(request.getSaturacaoO2())
                .fonte(request.getFonte() != null ? request.getFonte() : "MANUAL")
                .observacoes(request.getObservacoes())
                .build();

        leituraRepository.save(leitura);

        log.info("[AELA] Leitura registrada com sucesso para {}", operador.getNome());

        // Retorna o próprio request como confirmação (simplificado)
        return request;
    }

    @Override
    @Transactional(readOnly = true)
    public List<AelaDto.LeituraRequest> listarPorOperador(Long operadorId) {

        if (!operadorRepository.existsById(operadorId)) {
            throw new AelaException.RecursoNaoEncontradoException("Operador", operadorId);
        }

        return leituraRepository.findByOperadorIdOrderByDataLeituraDesc(operadorId)
                .stream()
                .map(this::toRequest)
                .collect(Collectors.toList());
    }

    private AelaDto.LeituraRequest toRequest(LeituraFisiologica l) {
        return AelaDto.LeituraRequest.builder()
                .freqCardiaca(l.getFreqCardiaca())
                .pressaoSistolica(l.getPressaoSistolica())
                .pressaoDiastolica(l.getPressaoDiastolica())
                .tempoReacaoMs(l.getTempoReacaoMs())
                .scoreEquilibrio(l.getScoreEquilibrio())
                .pressaoOcular(l.getPressaoOcular())
                .acuidadeVisual(l.getAcuidadeVisual())
                .scoreCognitivo(l.getScoreCognitivo())
                .horasSono(l.getHorasSono())
                .saturacaoO2(l.getSaturacaoO2())
                .missaoId(l.getMissao() != null ? l.getMissao().getId() : null)
                .fonte(l.getFonte())
                .observacoes(l.getObservacoes())
                .build();
    }
}
