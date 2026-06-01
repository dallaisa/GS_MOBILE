package br.com.aela.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.*;

import java.time.LocalDateTime;

/**
 * ENTIDADE: LeituraFisiologica
 *
 * Representa uma leitura pontual dos sinais vitais do operador durante a missão.
 * Cada leitura é timestampada (UTC) e associada a um operador e uma missão.
 *
 * ─── Programação procedural ──────────────────────────────────────
 * Leituras são processadas sequencialmente: chegam → são validadas →
 * são comparadas ao baseline → geram um ReadinessScore → alimentam a Mesh.
 *
 * ─── POO ─────────────────────────────────────────────────────────
 * @ManyToOne: muitas leituras pertencem a um único operador.
 *             Uma leitura sem operador não existe (nullable = false).
 *
 * ─── SOA ─────────────────────────────────────────────────────────
 * Esta entidade é o payload central consumido pelo serviço de cálculo
 * de ReadinessScore (ReadinessService). A separação entre dados (entidade)
 * e lógica (serviço) é o princípio central de SOA.
 */
@Entity
@Table(name = "TB_LEITURA_FISIOLOGICA")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class LeituraFisiologica {

    @Id
    @GeneratedValue(
        strategy = GenerationType.SEQUENCE,
        generator = "seq_leitura"
    )
    @SequenceGenerator(
        name = "seq_leitura",
        sequenceName = "SEQ_LEITURA",
        allocationSize = 1
    )
    @Column(name = "ID_LEITURA")
    private Long id;

    // ── Relacionamentos ──────────────────────────────────────────────

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "ID_OPERADOR", nullable = false)
    private Operador operador;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "ID_MISSAO")
    private Missao missao; // nullable: leitura pode ser pré ou pós-missão

    // ── Métricas (mesmas dimensões do Baseline) ───────────────────────

    @NotNull @Min(30) @Max(250)
    @Column(name = "NR_FREQ_CARDIACA", nullable = false)
    private Double freqCardiaca;

    @NotNull @Min(60) @Max(300)
    @Column(name = "NR_PRESSAO_SISTOLICA", nullable = false)
    private Double pressaoSistolica;

    @NotNull @Min(40) @Max(200)
    @Column(name = "NR_PRESSAO_DIASTOLICA", nullable = false)
    private Double pressaoDiastolica;

    @NotNull @Min(50) @Max(2000)
    @Column(name = "NR_TEMPO_REACAO_MS", nullable = false)
    private Double tempoReacaoMs;

    @NotNull @Min(0) @Max(100)
    @Column(name = "NR_SCORE_EQUILIBRIO", nullable = false)
    private Double scoreEquilibrio;

    @NotNull @Min(5) @Max(80)
    @Column(name = "NR_PRESSAO_OCULAR", nullable = false)
    private Double pressaoOcular;

    @NotNull @Min(0) @Max(3)
    @Column(name = "NR_ACUIDADE_VISUAL", nullable = false)
    private Double acuidadeVisual;

    @NotNull @Min(0) @Max(100)
    @Column(name = "NR_SCORE_COGNITIVO", nullable = false)
    private Double scoreCognitivo;

    @NotNull @Min(0) @Max(24)
    @Column(name = "NR_HORAS_SONO", nullable = false)
    private Double horasSono;

    @NotNull @Min(50) @Max(100)
    @Column(name = "NR_SATURACAO_O2", nullable = false)
    private Double saturacaoO2;

    // ── Metadados ────────────────────────────────────────────────────

    /** Timestamp UTC da leitura — crítico para rastreamento longitudinal */
    @Column(name = "DT_LEITURA", nullable = false)
    private LocalDateTime dataLeitura;

    /** Fonte da leitura: WEARABLE, CAMERA, MANUAL, SENSOR_IOT */
    @Column(name = "DS_FONTE", length = 30)
    private String fonte;

    @Column(name = "DS_OBSERVACOES", length = 500)
    private String observacoes;

    @PrePersist
    public void prePersist() {
        // Sempre UTC para missões em múltiplos fusos horários
        this.dataLeitura = LocalDateTime.now();
    }
}
