package br.com.aela.service;

import br.com.aela.dto.AelaDto;
import br.com.aela.model.TipoTarefa;
import java.util.List;

public interface ReadinessService {

    /**
     * Calcula o ReadinessScore de um operador para um tipo de tarefa.
     * Compara a última leitura com o baseline individual.
     * Lança RegraDeNegocioException se não houver baseline ou leitura.
     */
    AelaDto.ReadinessScoreResponse calcular(Long operadorId, TipoTarefa tipoTarefa);

    /**
     * Ranking de prontidão da tripulação de uma missão para um tipo de tarefa.
     * Ordena do mais apto ao menos apto.
     */
    List<AelaDto.ReadinessScoreResponse> rankingMissao(Long missaoId, TipoTarefa tipoTarefa);
}
