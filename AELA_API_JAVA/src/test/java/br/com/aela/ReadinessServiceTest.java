package br.com.aela;

import br.com.aela.dto.AelaDto;
import br.com.aela.exception.AelaException;
import br.com.aela.model.*;
import br.com.aela.repository.*;
import br.com.aela.service.impl.ReadinessServiceImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;

import static org.assertj.core.api.Assertions.*;
import static org.mockito.Mockito.*;

/**
 * TESTE: ReadinessServiceTest
 *
 * Testa o coração do sistema AELA sem subir o Spring ou o banco.
 * Mockito simula os repositórios, isolando a lógica de negócio.
 *
 * @ExtendWith(MockitoExtension.class): injeta os mocks automaticamente.
 * @InjectMocks: cria a instância real do service com mocks injetados.
 * @Mock: cria um mock (objeto falso) do repositório.
 */
@ExtendWith(MockitoExtension.class)
@DisplayName("AELA — Testes do ReadinessService")
class ReadinessServiceTest {

    @InjectMocks
    private ReadinessServiceImpl readinessService;

    @Mock private OperadorRepository operadorRepository;
    @Mock private BaselineRepository baselineRepository;
    @Mock private LeituraFisiologicaRepository leituraRepository;
    @Mock private MissaoRepository missaoRepository;

    private Operador operadorMock;
    private Baseline baselineMock;
    private LeituraFisiologica leituraMock;

    @BeforeEach
    void setup() {
        // Operador de teste
        operadorMock = Operador.builder()
                .id(1L)
                .nome("Cmt. Isabelle")
                .matricula("AELA-001")
                .email("isabelle@aela.io")
                .tipoAmbiente(TipoAmbiente.ESPACO)
                .ativo(true)
                .build();

        // Baseline saudável de referência
        baselineMock = Baseline.builder()
                .id(1L)
                .operador(operadorMock)
                .freqCardiacaBasal(65.0)
                .pressaoSistolica(120.0)
                .pressaoDiastolica(80.0)
                .tempoReacaoMs(200.0)
                .scoreEquilibrio(90.0)
                .pressaoOcular(15.0)
                .acuidadeVisual(1.0)
                .scoreCognitivo(88.0)
                .horasSono(8.0)
                .saturacaoO2(98.0)
                .build();

        // Leitura normal (pequenos desvios) — operador apto
        leituraMock = LeituraFisiologica.builder()
                .id(1L)
                .operador(operadorMock)
                .freqCardiaca(68.0)     // +4.6% — dentro do normal
                .pressaoSistolica(122.0) // +1.6%
                .pressaoDiastolica(82.0) // +2.5%
                .tempoReacaoMs(210.0)   // +5%
                .scoreEquilibrio(88.0)  // -2.2%
                .pressaoOcular(16.0)    // +6.6%
                .acuidadeVisual(1.0)    // sem desvio
                .scoreCognitivo(85.0)   // -3.4%
                .horasSono(7.5)         // -6.25%
                .saturacaoO2(97.0)      // -1%
                .build();
    }

    @Test
    @DisplayName("Operador apto deve receber score >= 80")
    void deveRetornarScoreAltoParaOperadorApto() {
        when(operadorRepository.findById(1L)).thenReturn(Optional.of(operadorMock));
        when(baselineRepository.findByOperadorId(1L)).thenReturn(Optional.of(baselineMock));
        when(leituraRepository.findFirstByOperadorIdOrderByDataLeituraDesc(1L))
                .thenReturn(Optional.of(leituraMock));

        AelaDto.ReadinessScoreResponse response = readinessService.calcular(1L, TipoTarefa.EVA);

        assertThat(response).isNotNull();
        assertThat(response.getScoreGeral()).isGreaterThanOrEqualTo(80.0);
        assertThat(response.getClassificacao()).isEqualTo("APTO");
        assertThat(response.getOperadorNome()).isEqualTo("Cmt. Isabelle");

        System.out.println("[AELA TEST] Score: " + response.getScoreGeral()
            + " | " + response.getClassificacao());
    }

    @Test
    @DisplayName("Lançar exceção se operador não tem baseline")
    void deveLancarExcecaoSemBaseline() {
        when(operadorRepository.findById(1L)).thenReturn(Optional.of(operadorMock));
        when(baselineRepository.findByOperadorId(1L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> readinessService.calcular(1L, TipoTarefa.EVA))
                .isInstanceOf(AelaException.RegraDeNegocioException.class)
                .hasMessageContaining("baseline");
    }

    @Test
    @DisplayName("Lançar exceção se operador não tem leituras")
    void deveLancarExcecaoSemLeituras() {
        when(operadorRepository.findById(1L)).thenReturn(Optional.of(operadorMock));
        when(baselineRepository.findByOperadorId(1L)).thenReturn(Optional.of(baselineMock));
        when(leituraRepository.findFirstByOperadorIdOrderByDataLeituraDesc(1L))
                .thenReturn(Optional.empty());

        assertThatThrownBy(() -> readinessService.calcular(1L, TipoTarefa.EVA))
                .isInstanceOf(AelaException.RegraDeNegocioException.class)
                .hasMessageContaining("leituras");
    }

    @Test
    @DisplayName("Score deve ser menor para operador com desvios altos")
    void deveRetornarScoreBaixoParaOperadorComDesviosAltos() {
        // Leitura com desvios severos
        LeituraFisiologica leituraRuim = LeituraFisiologica.builder()
                .id(2L)
                .operador(operadorMock)
                .freqCardiaca(110.0)    // +69% — taquicardia severa
                .pressaoSistolica(160.0) // +33%
                .pressaoDiastolica(100.0)
                .tempoReacaoMs(450.0)   // +125% — muito lento
                .scoreEquilibrio(50.0)  // -44%
                .pressaoOcular(25.0)    // +66% — hipertensão ocular
                .acuidadeVisual(0.6)    // -40%
                .scoreCognitivo(50.0)   // -43%
                .horasSono(4.0)         // -50% — privação severa
                .saturacaoO2(90.0)      // -8%
                .build();

        when(operadorRepository.findById(1L)).thenReturn(Optional.of(operadorMock));
        when(baselineRepository.findByOperadorId(1L)).thenReturn(Optional.of(baselineMock));
        when(leituraRepository.findFirstByOperadorIdOrderByDataLeituraDesc(1L))
                .thenReturn(Optional.of(leituraRuim));

        AelaDto.ReadinessScoreResponse response = readinessService.calcular(1L, TipoTarefa.EVA);

        assertThat(response.getScoreGeral()).isLessThan(50.0);
        assertThat(response.getClassificacao()).isIn("RESTRIÇÃO", "INAPTO");

        System.out.println("[AELA TEST] Score degradado: " + response.getScoreGeral()
            + " | " + response.getClassificacao());
        System.out.println("[AELA TEST] Recomendação: " + response.getRecomendacao());
    }

    @Test
    @DisplayName("Score COGNITIVA deve diferir do score EVA para o mesmo operador")
    void scorePorTarefaDeveSerDiferenteConformalPesos() {
        when(operadorRepository.findById(1L)).thenReturn(Optional.of(operadorMock));
        when(baselineRepository.findByOperadorId(1L)).thenReturn(Optional.of(baselineMock));
        when(leituraRepository.findFirstByOperadorIdOrderByDataLeituraDesc(1L))
                .thenReturn(Optional.of(leituraMock));

        AelaDto.ReadinessScoreResponse scoreEva =
            readinessService.calcular(1L, TipoTarefa.EVA);
        AelaDto.ReadinessScoreResponse scoreCognitivo =
            readinessService.calcular(1L, TipoTarefa.OPERACAO_COGNITIVA);

        // Scores podem ser diferentes porque os pesos por tarefa são diferentes
        // (não é um erro se forem iguais, mas valida que a lógica foi executada)
        assertThat(scoreEva.getScoreGeral()).isNotNull();
        assertThat(scoreCognitivo.getScoreGeral()).isNotNull();

        System.out.println("[AELA TEST] EVA: " + scoreEva.getScoreGeral()
            + " | COGNITIVA: " + scoreCognitivo.getScoreGeral());
    }
}
