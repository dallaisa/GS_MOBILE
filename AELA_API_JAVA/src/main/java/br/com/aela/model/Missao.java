package br.com.aela.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

/**
 * ENTIDADE: Missao
 *
 * Representa uma missão ou operação em ambiente extremo.
 * Uma missão agrupa uma tripulação, um ambiente, um período e
 * todas as leituras registradas durante ela.
 *
 * ─── POO: ManyToMany ─────────────────────────────────────────────
 * Uma missão tem vários operadores (tripulação).
 * Um operador pode participar de várias missões.
 * A tabela de junção TB_MISSAO_OPERADOR é gerenciada automaticamente.
 */
@Entity
@Table(name = "TB_MISSAO")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Missao {

    @Id
    @GeneratedValue(
        strategy = GenerationType.SEQUENCE,
        generator = "seq_missao"
    )
    @SequenceGenerator(
        name = "seq_missao",
        sequenceName = "SEQ_MISSAO",
        allocationSize = 1
    )
    @Column(name = "ID_MISSAO")
    private Long id;

    @NotBlank(message = "Nome da missão é obrigatório")
    @Column(name = "NM_MISSAO", nullable = false, length = 150)
    private String nome;

    @Column(name = "DS_MISSAO", length = 500)
    private String descricao;

    @NotNull(message = "Tipo de ambiente é obrigatório")
    @Enumerated(EnumType.STRING)
    @Column(name = "TP_AMBIENTE", nullable = false, length = 20)
    private TipoAmbiente tipoAmbiente;

    @Column(name = "DT_INICIO")
    private LocalDateTime dataInicio;

    @Column(name = "DT_FIM")
    private LocalDateTime dataFim;

    /** PLANEJADA → EM_ANDAMENTO → CONCLUIDA → ABORTADA */
    @Column(name = "DS_STATUS", length = 20)
    @Builder.Default
    private String status = "PLANEJADA";

    @Column(name = "DT_CADASTRO", nullable = false, updatable = false)
    private LocalDateTime dataCadastro;

    // ── ManyToMany: tripulação da missão ─────────────────────────────
    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(
        name = "TB_MISSAO_OPERADOR",
        joinColumns = @JoinColumn(name = "ID_MISSAO"),
        inverseJoinColumns = @JoinColumn(name = "ID_OPERADOR")
    )
    @Builder.Default
    private List<Operador> tripulacao = new ArrayList<>();

    @PrePersist
    public void prePersist() {
        this.dataCadastro = LocalDateTime.now();
    }
}
