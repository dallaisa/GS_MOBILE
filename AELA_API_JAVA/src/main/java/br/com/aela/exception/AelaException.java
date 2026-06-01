package br.com.aela.exception;

/**
 * EXCEÇÕES CUSTOMIZADAS DA AELA
 *
 * ─── POO ─────────────────────────────────────────────────────────
 * Herança: todas herdam de RuntimeException (unchecked).
 * Isso permite que o Spring as capture via @ControllerAdvice
 * sem precisar declarar throws em cada método.
 *
 * ─── Programação procedural ──────────────────────────────────────
 * O fluxo de tratamento é sequencial:
 *   Service lança exceção → GlobalExceptionHandler captura →
 *   formata ErroResponse → retorna HTTP status correto.
 *
 * Todos os tipos no mesmo arquivo para organização didática.
 */
public class AelaException {

    /**
     * Lançada quando um recurso não é encontrado no banco.
     * HTTP 404 Not Found.
     * Ex: operador com ID informado não existe.
     */
    public static class RecursoNaoEncontradoException extends RuntimeException {
        public RecursoNaoEncontradoException(String mensagem) {
            super(mensagem);
        }
        public RecursoNaoEncontradoException(String recurso, Long id) {
            super(recurso + " com ID " + id + " não encontrado.");
        }
    }

    /**
     * Lançada quando há violação de regra de negócio.
     * HTTP 422 Unprocessable Entity.
     * Ex: registrar leitura para operador sem baseline.
     */
    public static class RegraDeNegocioException extends RuntimeException {
        public RegraDeNegocioException(String mensagem) {
            super(mensagem);
        }
    }

    /**
     * Lançada quando há conflito de dados únicos.
     * HTTP 409 Conflict.
     * Ex: e-mail ou matrícula já cadastrados.
     */
    public static class ConflitoDeRecursoException extends RuntimeException {
        public ConflitoDeRecursoException(String mensagem) {
            super(mensagem);
        }
    }
}
