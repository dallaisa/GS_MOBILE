package br.com.aela.dto;

import br.com.aela.model.TipoAmbiente;
import jakarta.validation.constraints.*;
import lombok.*;

/**
 * DTOs — Data Transfer Objects
 *
 * ─── POO ─────────────────────────────────────────────────────────
 * DTOs são objetos simples que carregam dados entre camadas.
 * Separar DTO de Entidade é boas práticas: o cliente nunca manipula
 * a entidade diretamente, evitando exposição de campos internos e
 * ataques de mass assignment.
 *
 * ─── Lombok ──────────────────────────────────────────────────────
 * @Data → getters + setters + equals + hashCode + toString
 * @Builder → padrão builder para construção fluente
 * @NoArgsConstructor + @AllArgsConstructor → necessários para Jackson
 *   (desserialização JSON precisa do construtor vazio;
 *    @Builder precisa do construtor com todos os campos)
 *
 * Todos os DTOs estão neste arquivo para organização didática.
 * Em projetos maiores, cada DTO ficaria em seu próprio arquivo.
 */
public class AelaDto {

    // ════════════════════════════════════════════════════════════
    // OPERADOR — REQUEST (dados que o cliente envia)
    // ════════════════════════════════════════════════════════════

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class OperadorRequest {

        @NotBlank(message = "Nome é obrigatório")
        @Size(min = 2, max = 100)
        private String nome;

        @NotBlank(message = "Matrícula é obrigatória")
        private String matricula;

        @NotBlank(message = "E-mail é obrigatório")
        @Email(message = "Formato de e-mail inválido")
        private String email;

        @NotNull(message = "Tipo de ambiente é obrigatório")
        private TipoAmbiente tipoAmbiente;

        private String especialidade;
    }

    // ════════════════════════════════════════════════════════════
    // OPERADOR — RESPONSE (dados que a API retorna)
    // ════════════════════════════════════════════════════════════

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class OperadorResponse {
        private Long id;
        private String nome;
        private String matricula;
        private String email;
        private TipoAmbiente tipoAmbiente;
        private String especialidade;
        private Boolean ativo;
        private Boolean possuiBaseline;
        private String dataCadastro;
    }

    // ════════════════════════════════════════════════════════════
    // BASELINE — REQUEST
    // ════════════════════════════════════════════════════════════

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class BaselineRequest {

        @NotNull @Min(30) @Max(200)
        private Double freqCardiacaBasal;

        @NotNull @Min(60) @Max(250)
        private Double pressaoSistolica;

        @NotNull @Min(40) @Max(150)
        private Double pressaoDiastolica;

        @NotNull @Min(50) @Max(1000)
        private Double tempoReacaoMs;

        @NotNull @Min(0) @Max(100)
        private Double scoreEquilibrio;

        @NotNull @Min(5) @Max(60)
        private Double pressaoOcular;

        @NotNull @Min(0) @Max(3)
        private Double acuidadeVisual;

        @NotNull @Min(0) @Max(100)
        private Double scoreCognitivo;

        @NotNull @Min(1) @Max(24)
        private Double horasSono;

        @NotNull @Min(50) @Max(100)
        private Double saturacaoO2;

        private String observacoes;
    }

    // ════════════════════════════════════════════════════════════
    // BASELINE — RESPONSE
    // ════════════════════════════════════════════════════════════

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class BaselineResponse {
        private Long id;
        private Long operadorId;
        private String operadorNome;
        private Double freqCardiacaBasal;
        private Double pressaoSistolica;
        private Double pressaoDiastolica;
        private Double tempoReacaoMs;
        private Double scoreEquilibrio;
        private Double pressaoOcular;
        private Double acuidadeVisual;
        private Double scoreCognitivo;
        private Double horasSono;
        private Double saturacaoO2;
        private String dataColeta;
        private String observacoes;
    }

    // ════════════════════════════════════════════════════════════
    // LEITURA FISIOLÓGICA — REQUEST
    // ════════════════════════════════════════════════════════════

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class LeituraRequest {

        @NotNull @Min(30) @Max(250)
        private Double freqCardiaca;

        @NotNull @Min(60) @Max(300)
        private Double pressaoSistolica;

        @NotNull @Min(40) @Max(200)
        private Double pressaoDiastolica;

        @NotNull @Min(50) @Max(2000)
        private Double tempoReacaoMs;

        @NotNull @Min(0) @Max(100)
        private Double scoreEquilibrio;

        @NotNull @Min(5) @Max(80)
        private Double pressaoOcular;

        @NotNull @Min(0) @Max(3)
        private Double acuidadeVisual;

        @NotNull @Min(0) @Max(100)
        private Double scoreCognitivo;

        @NotNull @Min(0) @Max(24)
        private Double horasSono;

        @NotNull @Min(50) @Max(100)
        private Double saturacaoO2;

        private Long missaoId;     // opcional — pode ser leitura pré ou pós-missão
        private String fonte;      // WEARABLE | CAMERA | MANUAL | SENSOR_IOT
        private String observacoes;
    }

    // ════════════════════════════════════════════════════════════
    // READINESS SCORE — RESPONSE
    // ════════════════════════════════════════════════════════════

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ReadinessScoreResponse {
        private Long operadorId;
        private String operadorNome;
        private String tipoTarefa;
        private Double scoreGeral;           // 0–100
        private Double desvioCardiovascular;  // % de desvio do baseline
        private Double desvioSensoriomotor;
        private Double desvioOcular;
        private Double desvioCognitivo;
        private Double desvioRecuperacao;
        private String classificacao;        // APTO / MONITORAMENTO / RESTRICAO / INAPTO
        private String recomendacao;
        private String dataCalculo;
    }

    // ════════════════════════════════════════════════════════════
    // MISSÃO — REQUEST / RESPONSE
    // ════════════════════════════════════════════════════════════

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class MissaoRequest {

        @NotBlank(message = "Nome da missão é obrigatório")
        private String nome;

        private String descricao;

        @NotNull(message = "Tipo de ambiente é obrigatório")
        private TipoAmbiente tipoAmbiente;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class MissaoResponse {
        private Long id;
        private String nome;
        private String descricao;
        private TipoAmbiente tipoAmbiente;
        private String status;
        private Integer totalTripulacao;
        private String dataInicio;
        private String dataFim;
        private String dataCadastro;
    }

    // ════════════════════════════════════════════════════════════
    // RESPOSTA PADRÃO DE ERRO
    // ════════════════════════════════════════════════════════════

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ErroResponse {
        private int status;
        private String erro;
        private String mensagem;
        private String timestamp;
        private String path;
    }
}
