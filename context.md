***

```markdown
# Contexto do Projeto: AppFinanceiro (Arquitetura de Microsserviços)

## Visão Geral
O **AppFinanceiro** é uma aplicação de gestão de finanças pessoais. Este repositório representa a evolução da aplicação de uma arquitetura "Frontend + BaaS" (React + Supabase) para uma **Arquitetura Orientada a Serviços (SOA)** baseada em microsserviços. 

O objetivo desta transição é escalar o projeto, separar responsabilidades de domínio e implementar padrões arquiteturais de nível corporativo.

## Arquitetura do Sistema (SOA)

A aplicação está dividida nas seguintes camadas operacionais:

1. **Frontend (Interface do Usuário):**
   - Construído com React e Vite.
   - Responsável apenas pela camada de apresentação e interação do usuário.
   - Autenticação baseada em JWT gerado pelo Supabase Auth.
   - Comunica-se exclusivamente com o API Gateway.

2. **API Gateway (Porta de Entrada):**
   - Construído em Node.js com Express.
   - Atua como um proxy reverso e orquestrador.
   - **Autorização:** Intercepta as requisições do Frontend, valida o token JWT do usuário e repassa a requisição autenticada para os microsserviços internos.

3. **Microsserviço A: Core Financeiro (Framework 1):**
   - Construído em Node.js com Fastify.
   - **Domínio:** Lida com todo o CRUD transacional. Cadastro de despesas, receitas, categorias, metas financeiras e cálculo de saldos.
   - Comunica-se diretamente com o banco de dados PostgreSQL (via Supabase).

4. **Microsserviço B: Automações e Inteligência (Framework 2):**
   - Construído em Python com FastAPI.
   - **Domínio:** Lida com operações assíncronas ou pesadas, como importação/leitura de arquivos CSV, geração de relatórios complexos e futuras integrações para automação de entrada de dados.

## Requisitos Acadêmicos e Técnicos Atendidos

Este projeto foi estruturado para cumprir rigorosamente os seguintes requisitos:
- [x] **Web API e Web Services:** Uso do protocolo HTTP e métodos RESTful (GET, POST, PUT, DELETE) em toda a comunicação entre Gateway e Serviços.
- [x] **Web API (2 Frameworks):** Implementação utilizando Fastify (Node.js) e FastAPI (Python).
- [x] **Microsserviços e API Gateway:** Desacoplamento da regra de negócio em serviços isolados por domínio, roteados por um Gateway central.
- [x] **Autenticação e Autorização:** Uso de JWT no frontend, com validação de identidade e controle de acesso no API Gateway.
- [x] **SOA (Service-Oriented Architecture):** Design focado em serviços independentes que se comunicam através da rede.
- [x] **Testes Unitários e Integração:** Cobertura de código implementada utilizando `Vitest` (ecossistema JS/Node) e `PyTest` (ecossistema Python).

## Estrutura de Diretórios

```text
/
├── frontend/                 # Aplicação React atual (UI/UX)
├── gateway/                  # API Gateway em Node.js/Express
├── services/                 # Microsserviços independentes
│   ├── finance-core/         # API REST em Node.js/Fastify (CRUD Financeiro)
│   └── automation-service/   # API REST em Python/FastAPI (Processamento/CSV)
├── tests/                    # Testes de integração (End-to-End e Gateway)
└── docker-compose.yml        # (Opcional futuro) Para orquestrar os serviços localmente
```

## Stack Tecnológica Consolidada

* **Frontend:** React, Vite, TailwindCSS.
* **Gateway:** Node.js, Express, jsonwebtoken (JWT).
* **Microsserviço A:** Node.js, Fastify.
* **Microsserviço B:** Python, FastAPI, Pandas (para CSV).
* **Banco de Dados & Auth:** Supabase (PostgreSQL).
* **Testes:** Vitest, PyTest, Supertest.

## Roadmap de Implementação (Próximos Passos)

1. **Fase 1: Preparação do Terreno**
   - Criar o novo repositório isolado.
   - Mover o código React existente para a pasta `/frontend`.
   - Garantir que o frontend continue rodando isoladamente.

2. **Fase 2: O Guardião (API Gateway)**
   - Inicializar o projeto Node.js na pasta `/gateway`.
   - Configurar o Express e o middleware de validação JWT do Supabase.
   - Criar rotas de proxy temporárias.

3. **Fase 3: O Motor (Core Financeiro)**
   - Inicializar o Fastify em `/services/finance-core`.
   - Migrar a lógica de acesso a dados (Supabase Client) do React para esta API.
   - Escrever os primeiros testes unitários com Vitest.

4. **Fase 4: A Inteligência (Automação Python)**
   - Inicializar o ambiente virtual Python em `/services/automation-service`.
   - Criar a rota de upload e processamento de CSV no FastAPI.
   - Escrever testes unitários com PyTest.

5. **Fase 5: Integração e Refinamento**
   - Apontar o React (`/frontend`) para consumir os dados exclusivamente do Gateway.
   - Escrever testes de integração validando o fluxo: `React -> Gateway -> Microsserviço -> Banco de dados`.
```

***