package br.com.aela;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

/**
 * AELA — Adaptive Exposome Life Assessment
 *
 * Ponto de entrada da aplicação Spring Boot.
 *
 * @SpringBootApplication combina:
 *   - @Configuration       → classe de configuração Spring
 *   - @EnableAutoConfiguration → configura beans automaticamente
 *   - @ComponentScan       → escaneia pacotes em busca de componentes
 *
 * Programação procedural: o método main() executa de cima para baixo,
 * inicializando o contexto Spring de forma sequencial.
 */
@SpringBootApplication
public class AelaApplication {

    public static void main(String[] args) {
        SpringApplication.run(AelaApplication.class, args);
        System.out.println("""
                ╔══════════════════════════════════════════╗
                ║   AELA API — Sistema de Prontidão        ║
                ║   Adaptive Exposome Life Assessment      ║
                ║   Porta: 8080                            ║
                ║   Health: /actuator/health               ║
                ╚══════════════════════════════════════════╝
                """);
    }
}
