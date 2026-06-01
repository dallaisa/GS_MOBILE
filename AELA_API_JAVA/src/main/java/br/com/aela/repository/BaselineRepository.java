package br.com.aela.repository;

import br.com.aela.model.Baseline;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

/**
 * REPOSITORY: BaselineRepository
 * Acesso ao baseline fisiológico do operador.
 */
@Repository
public interface BaselineRepository extends JpaRepository<Baseline, Long> {

    // Busca o baseline pelo ID do operador
    Optional<Baseline> findByOperadorId(Long operadorId);

    // Verifica se operador já possui baseline
    boolean existsByOperadorId(Long operadorId);
}
