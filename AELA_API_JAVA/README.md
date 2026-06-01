# AELA — Adaptive Exposome Life Assessment
### API Java | FIAP Global Solution 2025 | Space Connect

---

## Visão Geral

O **AELA** é o back-end principal do sistema de inteligência biológica coletiva para ambientes extremos.
Esta API gerencia operadores, missões, baselines fisiológicos e leituras em tempo real,
calculando o **ReadinessScore** — o score de prontidão operacional individual por tipo de tarefa.

**O que nos diferencia:** sistemas existentes comparam o operador com a média da população.  
O AELA compara o operador **com ele mesmo**, antes, durante e depois da missão.

---

## Integrantes

| Nome | RM |
|---|---|
| Camila Pedroza da Cunha | RM 558768 |
| Nicolli Amy Kassa | RM 559104 |
| Isabelle Dallabeneta Carlesso | RM 554592 |

---

## Conexão com o Tema Espacial e ODS

A API resolve um problema documentado pelo **NASA Human Research Program**: nenhum sistema hoje
traduz o estado fisiológico individual de um astronauta em uma decisão operacional concreta.

**ODS relacionados:**
- ODS 3 — Saúde e Bem-Estar
- ODS 9 — Indústria, Inovação e Infraestrutura
- ODS 8 — Trabalho Decente e Crescimento Econômico

---

## Stack Tecnológica

| Tecnologia | Versão | Uso |
|---|---|---|
| Java | 17 | Linguagem |
| Spring Boot | 3.3.4 | Framework principal |
| Spring Data JPA | (via Boot) | ORM / Repositórios |
| Spring Validation | (via Boot) | Validação de DTOs |
| Lombok | (via Boot) | Redução de boilerplate |
| Oracle Database | 23c / XE | Persistência |
| ojdbc11 | 23.4.0.24.05 | Driver JDBC Oracle |
| JUnit 5 + Mockito | (via Boot) | Testes unitários |

---

## Estrutura do Projeto

```
aela-api/
├── src/main/java/br/com/aela/
│   ├── AelaApplication.java          ← ponto de entrada
│   ├── config/                        ← configurações globais
│   ├── controller/
│   │   ├── OperadorController.java    ← CRUD de operadores, baseline, leituras
│   │   ├── ReadinessController.java   ← cálculo de score e ranking
│   │   └── MissaoController.java      ← gestão de missões e tripulação
│   ├── dto/
│   │   └── AelaDto.java              ← todos os DTOs (Request/Response)
│   ├── exception/
│   │   ├── AelaException.java        ← exceções customizadas
│   │   └── GlobalExceptionHandler.java ← tratamento centralizado
│   ├── model/
│   │   ├── Operador.java             ← entidade principal
│   │   ├── Baseline.java             ← zero fisiológico
│   │   ├── LeituraFisiologica.java   ← leitura em tempo real
│   │   ├── Missao.java               ← missão/operação
│   │   ├── TipoAmbiente.java         ← enum de ambientes
│   │   └── TipoTarefa.java           ← enum de tipos de tarefa
│   ├── repository/                   ← interfaces JPA (SOA: camada de dados)
│   └── service/
│       ├── OperadorService.java      ← contrato (interface)
│       ├── BaselineService.java
│       ├── LeituraService.java
│       ├── ReadinessService.java
│       └── impl/                     ← implementações
├── src/main/resources/
│   └── application.properties        ← configuração Oracle e JPA
├── src/test/
│   └── ReadinessServiceTest.java     ← testes unitários
└── pom.xml
```

---

## Pré-requisitos

- Java 17+ instalado (`java -version`)
- Maven 3.8+ instalado (`mvn -version`)
- Oracle Database rodando (XE local ou instância da FIAP)
- Usuário Oracle criado com permissões (ver abaixo)

---

## Configuração do Banco Oracle

Edite `src/main/resources/application.properties`:

```properties
spring.datasource.url=jdbc:jdbc:oracle:thin:@oracle.fiap.com.br:1521:orcl
spring.datasource.username=rm
spring.datasource.password=ddmmaa
```

## Como Executar

```bash
# 1. Clone o repositório
git clone https://github.com/camipzcunha/AELA_GS.git
cd aela-api

# 2. Configure o banco em application.properties

# 3. Compile e execute
mvn spring-boot:run

```

A API estará disponível em `http://localhost:8080`

---

## Endpoints

### Operadores
| Método | Endpoint | Descrição |
|---|---|---|
| `POST` | `/api/operadores` | Cadastra operador |
| `GET` | `/api/operadores` | Lista operadores ativos |
| `GET` | `/api/operadores/{id}` | Detalha operador |
| `PUT` | `/api/operadores/{id}` | Atualiza operador |
| `DELETE` | `/api/operadores/{id}` | Desativa operador |
| `POST` | `/api/operadores/{id}/baseline` | Registra baseline |
| `GET` | `/api/operadores/{id}/baseline` | Consulta baseline |
| `POST` | `/api/operadores/{id}/leituras` | Registra leitura fisiológica |
| `GET` | `/api/operadores/{id}/leituras` | Histórico de leituras |

### ReadinessScore
| Método | Endpoint | Descrição |
|---|---|---|
| `GET` | `/api/readiness/operadores/{id}?tipoTarefa=EVA` | Score individual |
| `GET` | `/api/readiness/missoes/{id}/ranking?tipoTarefa=EVA` | Ranking da tripulação |

### Missões
| Método | Endpoint | Descrição |
|---|---|---|
| `POST` | `/api/missoes` | Cria missão |
| `GET` | `/api/missoes` | Lista missões |
| `POST` | `/api/missoes/{id}/tripulacao/{opId}` | Adiciona tripulante |
| `PATCH` | `/api/missoes/{id}/iniciar` | Inicia missão |
| `PATCH` | `/api/missoes/{id}/encerrar` | Encerra missão |

### Monitoramento
| Endpoint | Descrição |
|---|---|
| `GET /actuator/health` | Status da aplicação e banco |

---

## Fluxo de Uso

```
1. POST /api/operadores          → cadastra o operador
2. POST /api/operadores/1/baseline → registra o baseline (o "zero" dele)
3. POST /api/missoes             → cria a missão
4. POST /api/missoes/1/tripulacao/1 → adiciona operador à missão
5. PATCH /api/missoes/1/iniciar  → inicia a missão
6. POST /api/operadores/1/leituras → registra leitura (durante a missão)
7. GET  /api/readiness/operadores/1?tipoTarefa=EVA → ReadinessScore
8. GET  /api/readiness/missoes/1/ranking?tipoTarefa=EVA → ranking da tripulação
9. PATCH /api/missoes/1/encerrar → encerra missão (fase pós-missão)
```

---

## Executar Testes

```bash
mvn test
```

Os testes unitários do `ReadinessServiceTest` validam:
- Score >= 80 para operador com pequenos desvios (APTO)
- Score < 50 para operador com desvios severos (INAPTO)
- Exceções corretas para operadores sem baseline ou leituras
- Diferença de score entre tipos de tarefa diferentes

---

## Exemplos de Requisição (cURL)

```bash
# Cadastrar operador
curl -X POST http://localhost:8080/api/operadores \
  -H "Content-Type: application/json" \
  -d '{
    "nome": "Cmt. Isabelle",
    "matricula": "AELA-001",
    "email": "isabelle@aela.io",
    "tipoAmbiente": "ESPACO",
    "especialidade": "Operações Extraveiculares"
  }'

# Registrar baseline
curl -X POST http://localhost:8080/api/operadores/1/baseline \
  -H "Content-Type: application/json" \
  -d '{
    "freqCardiacaBasal": 65.0,
    "pressaoSistolica": 120.0,
    "pressaoDiastolica": 80.0,
    "tempoReacaoMs": 200.0,
    "scoreEquilibrio": 90.0,
    "pressaoOcular": 15.0,
    "acuidadeVisual": 1.0,
    "scoreCognitivo": 88.0,
    "horasSono": 8.0,
    "saturacaoO2": 98.0
  }'

# Registrar leitura
curl -X POST http://localhost:8080/api/operadores/1/leituras \
  -H "Content-Type: application/json" \
  -d '{
    "freqCardiaca": 72.0,
    "pressaoSistolica": 125.0,
    "pressaoDiastolica": 83.0,
    "tempoReacaoMs": 220.0,
    "scoreEquilibrio": 85.0,
    "pressaoOcular": 16.5,
    "acuidadeVisual": 0.95,
    "scoreCognitivo": 82.0,
    "horasSono": 6.5,
    "saturacaoO2": 97.0,
    "fonte": "WEARABLE"
  }'

# Calcular ReadinessScore
curl "http://localhost:8080/api/readiness/operadores/1?tipoTarefa=EVA"
```
