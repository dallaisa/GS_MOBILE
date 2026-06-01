package br.com.aela.service.impl;

import br.com.aela.dto.AelaDto;
import br.com.aela.exception.AelaException;
import br.com.aela.model.Operador;
import br.com.aela.repository.OperadorRepository;
import br.com.aela.service.OperadorService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

/**
 * IMPLEMENTAÇÃO: OperadorServiceImpl
 *
 * ─── POO ─────────────────────────────────────────────────────────
 * Implementa a interface OperadorService.
 * O Controller injeta OperadorService (interface), não esta classe.
 * Isso é o Princípio da Inversão de Dependência (SOLID).
 *
 * ─── Lombok ──────────────────────────────────────────────────────
 * @RequiredArgsConstructor: gera construtor com todos os campos final.
 *   Equivale a escrever manualmente o construtor de injeção.
 * @Slf4j: injeta o logger log sem declaração manual.
 *
 * ─── Spring ──────────────────────────────────────────────────────
 * @Service: marca como componente de serviço (camada de negócio).
 * @Transactional: garante que o método inteiro execute em uma
 *   única transação de banco. Se falhar, faz rollback automático.
 *
 * ─── Programação procedural ──────────────────────────────────────
 * Cada método executa uma sequência bem definida de passos:
 *   1. Validar entrada
 *   2. Verificar regras de negócio
 *   3. Persistir ou consultar
 *   4. Converter para DTO de resposta
 *   5. Retornar
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class OperadorServiceImpl implements OperadorService {

    // @RequiredArgsConstructor cria o construtor que injeta este campo
    private final OperadorRepository operadorRepository;

    // ── CADASTRAR ────────────────────────────────────────────────────
    @Override
    @Transactional
    public AelaDto.OperadorResponse cadastrar(AelaDto.OperadorRequest request) {

        log.info("[AELA] Iniciando cadastro de operador: {}", request.getEmail());

        // Passo 1: validar unicidade do e-mail
        if (operadorRepository.existsByEmail(request.getEmail())) {
            throw new AelaException.ConflitoDeRecursoException(
                "E-mail já cadastrado: " + request.getEmail()
            );
        }

        // Passo 2: validar unicidade da matrícula
        if (operadorRepository.existsByMatricula(request.getMatricula())) {
            throw new AelaException.ConflitoDeRecursoException(
                "Matrícula já cadastrada: " + request.getMatricula()
            );
        }

        // Passo 3: construir a entidade usando o Builder (Lombok)
        Operador operador = Operador.builder()
                .nome(request.getNome())
                .matricula(request.getMatricula())
                .email(request.getEmail())
                .tipoAmbiente(request.getTipoAmbiente())
                .especialidade(request.getEspecialidade())
                .ativo(true)
                .build();

        // Passo 4: persistir no Oracle — @PrePersist seta dataCadastro automaticamente
        Operador salvo = operadorRepository.save(operador);

        log.info("[AELA] Operador cadastrado com ID: {}", salvo.getId());

        // Passo 5: converter para DTO de resposta e retornar
        return toResponse(salvo);
    }

    // ── BUSCAR POR ID ────────────────────────────────────────────────
    @Override
    @Transactional(readOnly = true)
    public AelaDto.OperadorResponse buscarPorId(Long id) {

        // orElseThrow: se não encontrar, lança a exceção customizada
        Operador operador = operadorRepository.findById(id)
                .orElseThrow(() -> new AelaException.RecursoNaoEncontradoException("Operador", id));

        return toResponse(operador);
    }

    // ── LISTAR ATIVOS ────────────────────────────────────────────────
    @Override
    @Transactional(readOnly = true)
    public List<AelaDto.OperadorResponse> listarAtivos() {

        // Programação procedural com Stream API:
        // 1. Busca lista de entidades
        // 2. Mapeia cada entidade para um DTO (toResponse)
        // 3. Coleta como lista
        return operadorRepository.findByAtivoTrue()
                .stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    // ── ATUALIZAR ────────────────────────────────────────────────────
    @Override
    @Transactional
    public AelaDto.OperadorResponse atualizar(Long id, AelaDto.OperadorRequest request) {

        Operador operador = operadorRepository.findById(id)
                .orElseThrow(() -> new AelaException.RecursoNaoEncontradoException("Operador", id));

        // Verifica se o novo e-mail já pertence a outro operador
        if (!operador.getEmail().equals(request.getEmail())
                && operadorRepository.existsByEmail(request.getEmail())) {
            throw new AelaException.ConflitoDeRecursoException(
                "E-mail já em uso por outro operador: " + request.getEmail()
            );
        }

        // Atualiza os campos — @PreUpdate seta dataAtualizacao automaticamente
        operador.setNome(request.getNome());
        operador.setEmail(request.getEmail());
        operador.setTipoAmbiente(request.getTipoAmbiente());
        operador.setEspecialidade(request.getEspecialidade());

        return toResponse(operadorRepository.save(operador));
    }

    // ── DESATIVAR (soft delete) ──────────────────────────────────────
    @Override
    @Transactional
    public void desativar(Long id) {

        Operador operador = operadorRepository.findById(id)
                .orElseThrow(() -> new AelaException.RecursoNaoEncontradoException("Operador", id));

        operador.setAtivo(false);
        operadorRepository.save(operador);

        log.info("[AELA] Operador ID {} desativado.", id);
    }

    // ── MÉTODO AUXILIAR: Entidade → DTO ─────────────────────────────
    // Programação procedural: conversão sequencial campo a campo
    private AelaDto.OperadorResponse toResponse(Operador o) {
        return AelaDto.OperadorResponse.builder()
                .id(o.getId())
                .nome(o.getNome())
                .matricula(o.getMatricula())
                .email(o.getEmail())
                .tipoAmbiente(o.getTipoAmbiente())
                .especialidade(o.getEspecialidade())
                .ativo(o.getAtivo())
                // Verifica se o baseline foi carregado (pode ser lazy null)
                .possuiBaseline(o.getBaseline() != null)
                .dataCadastro(o.getDataCadastro() != null
                    ? o.getDataCadastro().toString() : null)
                .build();
    }
}
