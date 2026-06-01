package br.com.aela.model;

/**
 * Tipos de ambiente extremo suportados pela AELA.
 *
 * POO — Enum é um tipo especial de classe em Java.
 * Cada constante é uma instância única do enum.
 *
 * Programação procedural: o sistema usa switch/if sobre esse enum
 * para aplicar lógicas diferentes por tipo de operador.
 */
public enum TipoAmbiente {

    ESPACO("Missão Espacial / Órbita"),
    SUBMARINO("Operação Subaquática"),
    ALTITUDE("Alpinismo / Alta Altitude"),
    COMBATE("Zona de Conflito / Operação Militar"),
    INCENDIO("Combate a Incêndio Florestal"),
    DESASTRE("Resposta a Desastre Natural"),
    OFFSHORE("Plataforma Offshore"),
    POLAR("Expedição Polar");

    // Atributo da instância do enum — POO: encapsulamento
    private final String descricao;

    // Construtor privado do enum
    TipoAmbiente(String descricao) {
        this.descricao = descricao;
    }

    public String getDescricao() {
        return descricao;
    }
}
