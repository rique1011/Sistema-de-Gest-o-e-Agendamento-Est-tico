# 🩺 BioSchedule - Sistema de Gestão e Agendamento Estético

O **BioSchedule** é uma plataforma modular de alta performance projetada para clínicas de biomedicina estética. Sua arquitetura flexível permite a fácil adaptação para qualquer setor que dependa de agendamentos e prontuários estruturados (odontologia, estúdios de tatuagem ou consultórios).

---

## 1. Domínio do Problema
Clínicas de estética enfrentam desafios críticos na gestão de horários e na manutenção de históricos detalhados. O sistema visa resolver:
* **Fragmentação de dados:** Centraliza prontuários, fotos de evolução e agendamentos em um só lugar.
* **Ociosidade e Conflitos:** Otimiza a agenda com base na duração real de cada procedimento técnico.
* **Segurança Jurídica:** Mantém um registro cronológico de intervenções para acompanhamento de resultados.

## 2. Funcionalidades Principais (Operations)
* **Agenda Dinâmica com Bloqueio de Conflitos:** O backend valida a disponibilidade entre `data_inicio` e `data_fim`, impedindo sobreposições.
* **Cálculo Automático de Tempo:** Otimização de janelas de atendimento baseada na duração cadastrada de cada serviço.
* **Prontuário de Evolução Estética:** Registro de anamnese e acompanhamento de resultados vinculado ao histórico do paciente.
* **Segurança Robusta:** Autenticação via JWT (JSON Web Token) e criptografia de senhas com Bcrypt.
* **Motor de Serviços Configurável:** Interface para cadastrar qualquer serviço com tempos e valores variados (Adaptabilidade).

## 3. Requisitos do Sistema

### ✅ Requisitos Funcionais (RF)
* **RF01 - Gestão de Usuários (Staff):** Cadastro de funcionários com senhas criptografadas.
* **RF02 - Autenticação Segura:** Sistema de Login com emissão de Token JWT (Bearer).
* **RF03 - Gestão de Pacientes:** CRUD completo e histórico de procedimentos.
* **RF04 - Catálogo de Serviços:** Cadastro de procedimentos com preço e tempo de duração.
* **RF05 - Agenda Inteligente:** Bloqueio automático de horários conflitantes.
* **RF06 - Filtro de Atendimento:** Busca de agendamentos por data para a recepção.

### 🛠 Requisitos Não Funcionais (RNF)
* **RNF01 - Persistência:** PostgreSQL para garantir integridade referencial.
* **RNF02 - Segurança:** Implementação de `AuthGuards` em rotas sensíveis.
* **RNF03 - Documentação:** API totalmente documentada via Swagger (OpenAPI).
* **RNF04 - Testabilidade:** Cobertura de testes unitários e de integração (E2E).

## 4. Tecnologias Utilizadas

| Tecnologia | Função | Justificativa |
| :--- | :--- | :--- |
| **Node.js (NestJS)** | Backend | Arquitetura modular (MVC) e tipagem segura com TypeScript. |
| **PostgreSQL** | Banco de Dados | Confiabilidade para dados estruturados. |
| **Prisma ORM** | Integração | Facilita a manutenção do banco e garante Type-safety. |
| **JWT & Bcrypt** | Segurança | Autenticação padrão de mercado e proteção de dados sensíveis. |
| **Swagger** | Documentação | Facilita o consumo da API pelo Frontend. |
| **Jest & Supertest** | Testes | Garantia de qualidade e validação de regras de negócio. |
| **Docker** | Infraestrutura | Ambiente isolado com Docker Compose. |

## 5. Como Executar o Projeto

### Pré-requisitos
* Docker e Docker Compose instalados.
* Node.js v18+.

### Instalação
1. **Clone o repositório:**
   ```bash
   git clone [https://github.com/seu-usuario/bioschedule-backend.git](https://github.com/seu-usuario/bioschedule-backend.git)

Suba o banco de dados via Docker:

Bash
docker-compose up -d
Configuração do ambiente:
Crie um arquivo .env na raiz do projeto seguindo o modelo:

Snippet de código
DATABASE_URL="postgresql://admin:senha123@localhost:5432/bioschedule?schema=public"
JWT_SECRET="sua_chave_secreta_segura"
Instale as dependências e aplique as migrations:

Bash
npm install
npx prisma migrate dev
Inicie o servidor em modo de desenvolvimento:

Bash
npm run start:dev
6. Documentação e Qualidade
API Documentation (Swagger)
A documentação interativa das rotas pode ser acessada em:
--> http://localhost:3000/api

Suíte de Testes (Status: All Green)
O projeto conta com validação automatizada para garantir que novas funcionalidades não quebrem o que já existe:

Testes Unitários: npm run test (Valida lógica de conflitos e serviços).

Testes E2E (Invasão): npm run test:e2e (Valida a eficácia dos filtros de segurança)
