package br.com.aela.model;

/**
 * Tipos de tarefa operacional para cálculo de ReadinessScore.
 *
 * O ReadinessScore varia por tarefa porque cada uma exige
 * um perfil fisiológico diferente.
 *
 * Exemplo:
 *   EVA (spacewalk) → peso alto em sensoriomotor e cardiovascular
 *   OPERACAO_COGNITIVA → peso alto em tempo de reação e cognição
 *   TAREFA_FISICA → peso alto em muscular e cardiovascular
 */
public enum TipoTarefa {

    EVA("Atividade Extraveicular / Spacewalk"),
    OPERACAO_COGNITIVA("Operação de Precisão Cognitiva"),
    TAREFA_FISICA("Tarefa de Esforço Físico"),
    PILOTAGEM("Pilotagem / Manobra Crítica"),
    MONITORAMENTO("Monitoramento e Vigilância"),
    RESGATE("Operação de Resgate");

    private final String descricao;

    TipoTarefa(String descricao) {
        this.descricao = descricao;
    }

    public String getDescricao() {
        return descricao;
    }
}
