package br.com.aela.service;

import br.com.aela.dto.AelaDto;
import br.com.aela.model.TipoTarefa;
import java.util.List;

/** CONTRATO: Gestão de baselines fisiológicos */
public interface BaselineService {

    /** Registra ou atualiza o baseline do operador */
    AelaDto.BaselineResponse registrar(Long operadorId, AelaDto.BaselineRequest request);

    /** Busca o baseline de um operador */
    AelaDto.BaselineResponse buscarPorOperador(Long operadorId);
}

// ─────────────────────────────────────────────────────────────────────
// Arquivo separado seria o ideal; aqui junto por praticidade didática
// ─────────────────────────────────────────────────────────────────────

