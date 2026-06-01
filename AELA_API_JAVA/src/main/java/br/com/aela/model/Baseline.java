package br.com.aela.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.*;

import java.time.LocalDateTime;

/**
 * ENTIDADE: Baseline
 *
 * O baseline é o "zero" fisiológico de cada operador — coletado ANTES
 * da missão, em condições ideais de saúde e descanso.
 *
 * Todos os desvios durante a missão são calculados em relação a esses valores.
 * Um operador sem baseline não pode receber ReadinessScore.
 *
 * ─── POO ─────────────────────────────────────────────────────────
 * @OneToOne: Baseline existe em função de Operador (composição).
 *            Sem o Operador, o Baseline não existe.
 *
 * ─── Métricas coletadas ──────────────────────────────────────────
 * Baseadas nos riscos documentados pelo NASA Human Research Program:
 *   - Cardiovascular: FC, PA sistólica/diastólica
 *   - Sensoriomotor: tempo de reação, equilíbrio
 *   - Ocular (SANS): pressão intraocular, acuidade visual
 *   - Cognitivo: score cognitivo basal
 *   - Sono: horas de sono de referência
 *   - Ósseo-muscular: saturação de O2 (proxy disponível sem laboratório)
 */
@Entity
@Table(name = "TB_BASELINE")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Baseline {

    @Id
    @GeneratedValue(
        strategy = GenerationType.SEQUENCE,
        generator = "seq_baseline"
    )
    @SequenceGenerator(
        name = "seq_baseline",
        sequenceName = "SEQ_BASELINE",
        allocationSize = 1
    )
    @Column(name = "ID_BASELINE")
    private Long id;

    // ── Relacionamento com Operador ──────────────────────────────────
    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "ID_OPERADOR", nullable = false, unique = true)
    private Operador operador;

    // ── Métricas cardiovasculares ────────────────────────────────────

    /** Frequência cardíaca em repouso (bpm) — normal: 60–100 */
    @NotNull @Min(30) @Max(200)
    @Column(name = "NR_FREQ_CARDIACA_BASAL", nullable = false)
    private Double freqCardiacaBasal;

    /** Pressão arterial sistólica (mmHg) — normal: 90–140 */
    @NotNull @Min(60) @Max(250)
    @Column(name = "NR_PRESSAO_SISTOLICA", nullable = false)
    private Double pressaoSistolica;

    /** Pressão arterial diastólica (mmHg) — normal: 60–90 */
    @NotNull @Min(40) @Max(150)
    @Column(name = "NR_PRESSAO_DIASTOLICA", nullable = false)
    private Double pressaoDiastolica;

    // ── Métricas sensoriomotoras ─────────────────────────────────────

    /** Tempo de reação (ms) — normal: 150–350ms */
    @NotNull @Min(50) @Max(1000)
    @Column(name = "NR_TEMPO_REACAO_MS", nullable = false)
    private Double tempoReacaoMs;

    /** Score de equilíbrio (0–100) — avaliado por teste padronizado */
    @NotNull @Min(0) @Max(100)
    @Column(name = "NR_SCORE_EQUILIBRIO", nullable = false)
    private Double scoreEquilibrio;

    // ── Métricas oculares (módulo SANS) ─────────────────────────────

    /** Pressão intraocular (mmHg) — normal: 10–21 */
    @NotNull @Min(5) @Max(60)
    @Column(name = "NR_PRESSAO_OCULAR", nullable = false)
    private Double pressaoOcular;

    /** Acuidade visual (escala 0.0–2.0, sendo 1.0 = normal) */
    @NotNull @Min(0) @Max(3)
    @Column(name = "NR_ACUIDADE_VISUAL", nullable = false)
    private Double acuidadeVisual;

    // ── Métricas cognitivas ──────────────────────────────────────────

    /** Score cognitivo basal (0–100) — bateria de testes cognitivos */
    @NotNull @Min(0) @Max(100)
    @Column(name = "NR_SCORE_COGNITIVO", nullable = false)
    private Double scoreCognitivo;

    // ── Métricas de recuperação ──────────────────────────────────────

    /** Horas de sono de referência (h) — normal: 7–9h */
    @NotNull @Min(1) @Max(24)
    @Column(name = "NR_HORAS_SONO", nullable = false)
    private Double horasSono;

    /** Saturação de oxigênio (%) — normal: 95–100% */
    @NotNull @Min(50) @Max(100)
    @Column(name = "NR_SATURACAO_O2", nullable = false)
    private Double saturacaoO2;

    // ── Controle ─────────────────────────────────────────────────────

    @Column(name = "DT_COLETA", nullable = false)
    private LocalDateTime dataColeta;

    @Column(name = "DS_OBSERVACOES", length = 500)
    private String observacoes;

    @PrePersist
    public void prePersist() {
        this.dataColeta = LocalDateTime.now();
    }
}
