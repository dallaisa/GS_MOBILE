package br.com.aela.repository;

import br.com.aela.model.Missao;
import br.com.aela.model.TipoAmbiente;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MissaoRepository extends JpaRepository<Missao, Long> {

    List<Missao> findByStatus(String status);

    List<Missao> findByTipoAmbiente(TipoAmbiente tipoAmbiente);

    // Missões ativas onde um operador específico está na tripulação
    @Query("""
        SELECT m FROM Missao m JOIN m.tripulacao o
        WHERE o.id = :operadorId AND m.status = 'EM_ANDAMENTO'
    """)
    List<Missao> findMissoesAtivasByOperador(@Param("operadorId") Long operadorId);
}
