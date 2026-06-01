package br.com.aela.repository;

import br.com.aela.model.LeituraFisiologica;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

/**
 * REPOSITORY: LeituraFisiologicaRepository
 *
 * Queries específicas para recuperação do histórico de leituras.
 * Programação procedural: as leituras são recuperadas em ordem
 * cronológica para análise de tendência de desvio.
 */
@Repository
public interface LeituraFisiologicaRepository extends JpaRepository<LeituraFisiologica, Long> {

    // Todas as leituras de um operador, ordenadas do mais recente
    List<LeituraFisiologica> findByOperadorIdOrderByDataLeituraDesc(Long operadorId);

    // Última leitura de um operador (mais recente)
    Optional<LeituraFisiologica> findFirstByOperadorIdOrderByDataLeituraDesc(Long operadorId);

    // Leituras de um operador em uma missão específica
    List<LeituraFisiologica> findByOperadorIdAndMissaoIdOrderByDataLeituraDesc(
        Long operadorId, Long missaoId
    );

    // Leituras em um intervalo de datas (para análise pós-missão)
    @Query("""
        SELECT l FROM LeituraFisiologica l
        WHERE l.operador.id = :operadorId
        AND l.dataLeitura BETWEEN :inicio AND :fim
        ORDER BY l.dataLeitura ASC
    """)
    List<LeituraFisiologica> findByOperadorIdAndPeriodo(
        @Param("operadorId") Long operadorId,
        @Param("inicio") LocalDateTime inicio,
        @Param("fim") LocalDateTime fim
    );

    // Quantidade de leituras de um operador em uma missão
    long countByOperadorIdAndMissaoId(Long operadorId, Long missaoId);
}
