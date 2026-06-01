package br.com.aela.service.impl;

import br.com.aela.dto.AelaDto;
import br.com.aela.exception.AelaException;
import br.com.aela.model.Baseline;
import br.com.aela.model.Operador;
import br.com.aela.repository.BaselineRepository;
import br.com.aela.repository.OperadorRepository;
import br.com.aela.service.BaselineService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Slf4j
public class BaselineServiceImpl implements BaselineService {

    private final BaselineRepository baselineRepository;
    private final OperadorRepository operadorRepository;

    @Override
    @Transactional
    public AelaDto.BaselineResponse registrar(Long operadorId, AelaDto.BaselineRequest request) {

        log.info("[AELA] Registrando baseline para operador ID: {}", operadorId);

        // Passo 1: verificar se o operador existe
        Operador operador = operadorRepository.findById(operadorId)
                .orElseThrow(() -> new AelaException.RecursoNaoEncontradoException("Operador", operadorId));

        // Passo 2: verificar se já existe um baseline (permitir atualização)
        Baseline baseline = baselineRepository.findByOperadorId(operadorId)
                .orElse(new Baseline()); // cria novo se não existir

        // Passo 3: preencher os campos — sequência procedural clara
        baseline.setOperador(operador);
        baseline.setFreqCardiacaBasal(request.getFreqCardiacaBasal());
        baseline.setPressaoSistolica(request.getPressaoSistolica());
        baseline.setPressaoDiastolica(request.getPressaoDiastolica());
        baseline.setTempoReacaoMs(request.getTempoReacaoMs());
        baseline.setScoreEquilibrio(request.getScoreEquilibrio());
        baseline.setPressaoOcular(request.getPressaoOcular());
        baseline.setAcuidadeVisual(request.getAcuidadeVisual());
        baseline.setScoreCognitivo(request.getScoreCognitivo());
        baseline.setHorasSono(request.getHorasSono());
        baseline.setSaturacaoO2(request.getSaturacaoO2());
        baseline.setObservacoes(request.getObservacoes());

        Baseline salvo = baselineRepository.save(baseline);

        log.info("[AELA] Baseline ID {} salvo para operador {}", salvo.getId(), operador.getNome());

        return toResponse(salvo);
    }

    @Override
    @Transactional(readOnly = true)
    public AelaDto.BaselineResponse buscarPorOperador(Long operadorId) {

        Baseline baseline = baselineRepository.findByOperadorId(operadorId)
                .orElseThrow(() -> new AelaException.RecursoNaoEncontradoException(
                    "Baseline para o operador ID " + operadorId + " não encontrado. " +
                    "Registre o baseline antes de solicitar o ReadinessScore."
                ));

        return toResponse(baseline);
    }

    private AelaDto.BaselineResponse toResponse(Baseline b) {
        return AelaDto.BaselineResponse.builder()
                .id(b.getId())
                .operadorId(b.getOperador().getId())
                .operadorNome(b.getOperador().getNome())
                .freqCardiacaBasal(b.getFreqCardiacaBasal())
                .pressaoSistolica(b.getPressaoSistolica())
                .pressaoDiastolica(b.getPressaoDiastolica())
                .tempoReacaoMs(b.getTempoReacaoMs())
                .scoreEquilibrio(b.getScoreEquilibrio())
                .pressaoOcular(b.getPressaoOcular())
                .acuidadeVisual(b.getAcuidadeVisual())
                .scoreCognitivo(b.getScoreCognitivo())
                .horasSono(b.getHorasSono())
                .saturacaoO2(b.getSaturacaoO2())
                .dataColeta(b.getDataColeta() != null ? b.getDataColeta().toString() : null)
                .observacoes(b.getObservacoes())
                .build();
    }
}
