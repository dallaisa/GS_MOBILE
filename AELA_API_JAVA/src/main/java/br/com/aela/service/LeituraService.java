package br.com.aela.service;

import br.com.aela.dto.AelaDto;
import br.com.aela.model.TipoTarefa;
import java.util.List;

public interface LeituraService {

    /** Registra nova leitura fisiológica para o operador */
    AelaDto.LeituraRequest registrar(Long operadorId, AelaDto.LeituraRequest request);

    /** Retorna histórico de leituras do operador */
    List<AelaDto.LeituraRequest> listarPorOperador(Long operadorId);
}
