package br.com.aela.repository;

import br.com.aela.model.Operador;
import br.com.aela.model.TipoAmbiente;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * REPOSITORY: OperadorRepository
 *
 * ─── SOA ─────────────────────────────────────────────────────────
 * O Repository é a camada de acesso a dados — separada da lógica de negócio.
 * Quem chama o repositório é o Service, nunca o Controller diretamente.
 *
 * ─── Spring Data JPA ─────────────────────────────────────────────
 * JpaRepository fornece automaticamente:
 *   save(), findById(), findAll(), deleteById(), count(), existsById()
 *
 * Métodos derivados (Query by Method Name):
 *   findByEmail() → Spring gera o SQL automaticamente por convenção de nome
 *
 * @Query JPQL:
 *   Queries customizadas quando o método derivado não é suficiente.
 *   JPQL opera sobre entidades Java, não tabelas SQL — portanto usa
 *   nomes de classes e atributos Java (Operador, tipoAmbiente), não
 *   nomes de tabelas Oracle (TB_OPERADOR, TP_AMBIENTE).
 */
@Repository
public interface OperadorRepository extends JpaRepository<Operador, Long> {

    // Spring gera: SELECT * FROM TB_OPERADOR WHERE DS_EMAIL = ?
    Optional<Operador> findByEmail(String email);

    // Spring gera: SELECT * FROM TB_OPERADOR WHERE NR_MATRICULA = ?
    Optional<Operador> findByMatricula(String matricula);

    // Spring gera: SELECT * FROM TB_OPERADOR WHERE FL_ATIVO = 1
    List<Operador> findByAtivoTrue();

    // Spring gera: SELECT * FROM TB_OPERADOR WHERE TP_AMBIENTE = ?
    List<Operador> findByTipoAmbiente(TipoAmbiente tipoAmbiente);

    // Query JPQL customizada: busca operadores COM baseline registrado
    @Query("SELECT o FROM Operador o WHERE o.baseline IS NOT NULL AND o.ativo = true")
    List<Operador> findOperadoresComBaseline();

    // Query JPQL: busca operadores de uma missão específica
    @Query("SELECT o FROM Operador o JOIN o.missoes m WHERE m.id = :missaoId AND o.ativo = true")
    List<Operador> findByMissaoId(@Param("missaoId") Long missaoId);

    // Verifica unicidade de e-mail (para validação no service)
    boolean existsByEmail(String email);

    // Verifica unicidade de matrícula
    boolean existsByMatricula(String matricula);
}
