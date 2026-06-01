package br.com.aela.exception;

import br.com.aela.dto.AelaDto;
import jakarta.servlet.http.HttpServletRequest;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.stream.Collectors;

/**
 * GLOBAL EXCEPTION HANDLER
 *
 * ─── POO ─────────────────────────────────────────────────────────
 * @RestControllerAdvice: intercepta exceções de TODOS os Controllers.
 * Centraliza o tratamento de erros — sem try/catch espalhado pelo código.
 *
 * ─── Protocolos HTTP ─────────────────────────────────────────────
 * Cada tipo de exceção mapeia para um código HTTP semântico correto:
 *
 *   404 Not Found    → recurso não existe no banco
 *   409 Conflict     → duplicidade de dados únicos
 *   422 Unproc. Ent. → regra de negócio violada
 *   400 Bad Request  → validação de campos inválida
 *   500 Internal Err → erro inesperado
 *
 * ─── @Slf4j (Lombok) ─────────────────────────────────────────────
 * Gera automaticamente: private static final Logger log = ...
 * Uso: log.error("mensagem", variavel);
 */
@RestControllerAdvice
@Slf4j
public class GlobalExceptionHandler {

    // ── 404: Recurso não encontrado ──────────────────────────────────
    @ExceptionHandler(AelaException.RecursoNaoEncontradoException.class)
    public ResponseEntity<AelaDto.ErroResponse> handleNaoEncontrado(
            AelaException.RecursoNaoEncontradoException ex,
            HttpServletRequest request) {

        log.warn("[AELA] Recurso não encontrado: {}", ex.getMessage());

        return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(AelaDto.ErroResponse.builder()
                        .status(404)
                        .erro("Não encontrado")
                        .mensagem(ex.getMessage())
                        .timestamp(LocalDateTime.now().toString())
                        .path(request.getRequestURI())
                        .build());
    }

    // ── 409: Conflito de dados ───────────────────────────────────────
    @ExceptionHandler(AelaException.ConflitoDeRecursoException.class)
    public ResponseEntity<AelaDto.ErroResponse> handleConflito(
            AelaException.ConflitoDeRecursoException ex,
            HttpServletRequest request) {

        log.warn("[AELA] Conflito de recurso: {}", ex.getMessage());

        return ResponseEntity.status(HttpStatus.CONFLICT)
                .body(AelaDto.ErroResponse.builder()
                        .status(409)
                        .erro("Conflito")
                        .mensagem(ex.getMessage())
                        .timestamp(LocalDateTime.now().toString())
                        .path(request.getRequestURI())
                        .build());
    }

    // ── 422: Regra de negócio ────────────────────────────────────────
    @ExceptionHandler(AelaException.RegraDeNegocioException.class)
    public ResponseEntity<AelaDto.ErroResponse> handleRegraDeNegocio(
            AelaException.RegraDeNegocioException ex,
            HttpServletRequest request) {

        log.warn("[AELA] Regra de negócio violada: {}", ex.getMessage());

        return ResponseEntity.status(HttpStatus.UNPROCESSABLE_ENTITY)
                .body(AelaDto.ErroResponse.builder()
                        .status(422)
                        .erro("Regra de negócio")
                        .mensagem(ex.getMessage())
                        .timestamp(LocalDateTime.now().toString())
                        .path(request.getRequestURI())
                        .build());
    }

    // ── 400: Validação de campos (Bean Validation) ───────────────────
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<AelaDto.ErroResponse> handleValidacao(
            MethodArgumentNotValidException ex,
            HttpServletRequest request) {

        // Programação procedural: itera sobre todos os erros de campo
        // e os concatena em uma mensagem única
        String mensagem = ex.getBindingResult()
                .getFieldErrors()
                .stream()
                .map(FieldError::getDefaultMessage)
                .collect(Collectors.joining("; "));

        log.warn("[AELA] Erro de validação: {}", mensagem);

        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(AelaDto.ErroResponse.builder()
                        .status(400)
                        .erro("Dados inválidos")
                        .mensagem(mensagem)
                        .timestamp(LocalDateTime.now().toString())
                        .path(request.getRequestURI())
                        .build());
    }

    // ── 500: Erro inesperado ─────────────────────────────────────────
    @ExceptionHandler(Exception.class)
    public ResponseEntity<AelaDto.ErroResponse> handleGenerico(
            Exception ex,
            HttpServletRequest request) {

        // log.error registra stack trace completo no servidor
        log.error("[AELA] Erro inesperado em {}: {}", request.getRequestURI(), ex.getMessage(), ex);

        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(AelaDto.ErroResponse.builder()
                        .status(500)
                        .erro("Erro interno")
                        .mensagem("Ocorreu um erro inesperado. Consulte os logs do servidor.")
                        .timestamp(LocalDateTime.now().toString())
                        .path(request.getRequestURI())
                        .build());
    }
}
