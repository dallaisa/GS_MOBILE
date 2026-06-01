package br.com.aela.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

/**
 * ENTIDADE: Operador
 *
 * Representa qualquer pessoa que opera em ambiente extremo monitorada pela AELA:
 * astronauta, bombeiro, alpinista, médico de campo, mergulhador, etc.
 *
 * ─── POO ────────────────────────────────────────────────────────────
 * @Data      → gera getters, setters, toString, equals, hashCode (Lombok)
 * @Builder   → padrão Builder: Operador.builder().nome("...").build()
 * @Entity    → mapeia esta classe para uma tabela no Oracle
 *
 * ─── JPA ────────────────────────────────────────────────────────────
 * @Table     → nome da tabela no banco
 * @Id        → chave primária
 * @GeneratedValue → Oracle SEQUENCE para auto-incremento
 * @OneToMany → relacionamento: um Operador tem muitas Leituras e Missões
 *
 * ─── Lombok ─────────────────────────────────────────────────────────
 * Sem Lombok, teríamos ~80 linhas de getters/setters/construtores.
 * Com Lombok, são apenas anotações — o código é gerado em compile time.
 */
@Entity
@Table(name = "TB_OPERADOR")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Operador {

    @Id
    @GeneratedValue(
        strategy = GenerationType.SEQUENCE,
        generator = "seq_operador"
    )
    @SequenceGenerator(
        name = "seq_operador",
        sequenceName = "SEQ_OPERADOR",
        allocationSize = 1
    )
    @Column(name = "ID_OPERADOR")
    private Long id;

    // ── Dados pessoais ───────────────────────────────────────────────

    @NotBlank(message = "Nome é obrigatório")
    @Size(min = 2, max = 100, message = "Nome deve ter entre 2 e 100 caracteres")
    @Column(name = "NM_OPERADOR", nullable = false, length = 100)
    private String nome;

    @NotBlank(message = "Matrícula é obrigatória")
    @Column(name = "NR_MATRICULA", nullable = false, unique = true, length = 20)
    private String matricula;

    @NotBlank(message = "E-mail é obrigatório")
    @Email(message = "E-mail inválido")
    @Column(name = "DS_EMAIL", nullable = false, unique = true, length = 150)
    private String email;

    // ── Perfil operacional ───────────────────────────────────────────

    @NotNull(message = "Tipo de ambiente é obrigatório")
    @Enumerated(EnumType.STRING)
    @Column(name = "TP_AMBIENTE", nullable = false, length = 20)
    private TipoAmbiente tipoAmbiente;

    @Column(name = "DS_ESPECIALIDADE", length = 200)
    private String especialidade;

    // ── Controle de tempo ────────────────────────────────────────────
    // Programação procedural: datas são registradas sequencialmente
    // para rastrear o histórico longitudinal do operador

    @Column(name = "DT_CADASTRO", nullable = false, updatable = false)
    private LocalDateTime dataCadastro;

    @Column(name = "DT_ATUALIZACAO")
    private LocalDateTime dataAtualizacao;

    @Column(name = "FL_ATIVO", nullable = false)
    @Builder.Default
    private Boolean ativo = true;

    // ── Relacionamentos ──────────────────────────────────────────────

    /**
     * Um operador tem exatamente um baseline (seu 'zero' pessoal).
     * cascade = salva/deleta o baseline junto com o operador.
     */
    @OneToOne(mappedBy = "operador", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private Baseline baseline;

    /**
     * Um operador tem múltiplas leituras fisiológicas ao longo do tempo.
     * orphanRemoval = leituras órfãs são deletadas automaticamente.
     */
    @OneToMany(mappedBy = "operador", cascade = CascadeType.ALL,
               orphanRemoval = true, fetch = FetchType.LAZY)
    @Builder.Default
    private List<LeituraFisiologica> leituras = new ArrayList<>();

    /**
     * Um operador pode participar de várias missões.
     * ManyToMany: um operador em várias missões, uma missão com vários operadores.
     */
    @ManyToMany(mappedBy = "tripulacao", fetch = FetchType.LAZY)
    @Builder.Default
    private List<Missao> missoes = new ArrayList<>();

    // ── Hooks de ciclo de vida JPA ───────────────────────────────────

    /**
     * @PrePersist: executado automaticamente ANTES de salvar no banco.
     * Programação procedural: sequência de operações na ordem correta.
     */
    @PrePersist
    public void prePersist() {
        this.dataCadastro = LocalDateTime.now();
        this.dataAtualizacao = LocalDateTime.now();
        if (this.ativo == null) this.ativo = true;
    }

    /**
     * @PreUpdate: executado automaticamente ANTES de atualizar no banco.
     */
    @PreUpdate
    public void preUpdate() {
        this.dataAtualizacao = LocalDateTime.now();
    }
}
