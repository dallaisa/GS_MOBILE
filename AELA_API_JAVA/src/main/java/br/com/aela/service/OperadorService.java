package br.com.aela.service;

import br.com.aela.dto.AelaDto;
import java.util.List;

/**
 * INTERFACE: OperadorService
 *
 * ─── SOA (Service-Oriented Architecture) ─────────────────────────
 * A interface define o CONTRATO do serviço — o que ele faz, não como.
 * O Controller depende da interface, nunca da implementação.
 *
 * Isso garante:
 *   1. Desacoplamento: trocar a implementação não altera o Controller
 *   2. Testabilidade: mock da interface em testes unitários
 *   3. Clareza: a interface é a documentação viva do serviço
 *
 * ─── Programação procedural ──────────────────────────────────────
 * Cada método representa uma operação atômica e bem definida.
 * A ordem de chamada pelos controllers segue um fluxo lógico:
 *   cadastrar → registrarBaseline → registrarLeitura → calcularReadiness
 */
public interface OperadorService {

    /** Cadastra novo operador — valida unicidade de e-mail e matrícula */
    AelaDto.OperadorResponse cadastrar(AelaDto.OperadorRequest request);

    /** Busca operador por ID — lança RecursoNaoEncontradoException se não existir */
    AelaDto.OperadorResponse buscarPorId(Long id);

    /** Lista todos os operadores ativos */
    List<AelaDto.OperadorResponse> listarAtivos();

    /** Atualiza dados cadastrais do operador */
    AelaDto.OperadorResponse atualizar(Long id, AelaDto.OperadorRequest request);

    /** Desativa operador (soft delete — não remove do banco) */
    void desativar(Long id);
}
