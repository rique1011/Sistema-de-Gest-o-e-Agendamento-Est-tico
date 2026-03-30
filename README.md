# 🩺 BioSchedule - Sistema de Gestão e Agendamento 

O **BioSchedule** é uma plataforma modular de alta performance projetada para clínicas de biomedicina estética, oferecendo uma solução completa para **gestão de agendamentos e prontuários**. Sua arquitetura flexível permite a fácil adaptação para qualquer setor que dependa de agendamentos e prontuários estruturados, como odontologia, estúdios de tatuagem ou consultórios médicos.

O projeto está organizado em branches:
*   `main`: Documentação e diagramas.
*   `backend`: API REST desenvolvida com NestJS.
*   `frontend`: Interface web moderna desenvolvida com React e Vite.

---

## 1. Domínio do Problema

Clínicas de estética enfrentam desafios críticos na gestão de horários e na manutenção de históricos detalhados. O sistema visa resolver:

*   **Fragmentação de dados:** Centraliza prontuários, dados de pacientes e históricos de procedimentos.
*   **Ociosidade e Conflitos:** Otimiza a agenda com validações automáticas de disponibilidade e bloqueios manuais.
*   **Gestão de Expediente:** Configuração flexível de horários de abertura, fechamento e intervalos de almoço.

## 2. Funcionalidades Principais

*   **Agenda Inteligente:** Validação de conflitos entre agendamentos e bloqueios manuais.
*   **Gestão de Pacientes:** Cadastro completo com controle de CPF único e histórico.
*   **Catálogo de Serviços:** Definição de procedimentos com duração em minutos e valores.
*   **Dashboard Gerencial:** Visualização de métricas e status de atendimentos (Agendado, Confirmado, Cancelado, Concluído, Faltou).
*   **Configuração de Expediente:** Regras de horários por dia da semana.
*   **Segurança:** Autenticação JWT e proteção de rotas.

## 3. Requisitos do Sistema

### ✅ Requisitos Funcionais (RF)

*   **RF01 - Autenticação:** Login seguro para funcionários.
*   **RF02 - Gestão de Pacientes:** CRUD completo de pacientes.
*   **RF03 - Gestão de Serviços:** Cadastro de procedimentos com tempo e valor.
*   **RF04 - Agendamentos:** Criação e gestão de horários com cálculo automático de término.
*   **RF05 - Bloqueios de Agenda:** Criação de pausas manuais (ex: manutenção, folgas).
*   **RF06 - Configuração de Horários:** Definição de jornada de trabalho e almoço.
*   **RF07 - Dashboard:** Resumo de atividades e status da clínica.

### 🛠 Requisitos Não Funcionais (RNF)

*   **RNF01 - Persistência:** Banco de dados relacional PostgreSQL via Prisma ORM.
*   **RNF02 - Segurança:** Senhas criptografadas com Bcrypt e tokens JWT.
*   **RNF03 - Frontend Moderno:** SPA (Single Page Application) com React, Vite e Tailwind CSS.
*   **RNF04 - API REST:** Backend estruturado seguindo os princípios de modularidade do NestJS.
*   **RNF05 - Documentação:** Documentação de API via Swagger.

## 4. Tecnologias Utilizadas

### Backend
| Tecnologia | Função |
| :--- | :--- |
| **Node.js (NestJS)** | Framework principal |
| **Prisma ORM** | Modelagem e acesso ao banco |
| **PostgreSQL** | Banco de dados relacional |
| **Passport & JWT** | Estratégia de autenticação |

### Frontend
| Tecnologia | Função |
| :--- | :--- |
| **React 19** | Biblioteca de interface |
| **Vite** | Build tool e dev server |
| **Tailwind CSS** | Estilização utilitária |
| **Axios** | Consumo de API |
| **Lucide React** | Biblioteca de ícones |

## 5. Arquitetura do Sistema (Diagramas C4)

Os diagramas C4 (localizados na branch `main`) descrevem a arquitetura:

1.  **Contexto (Nível 1):** Visão geral dos usuários e sistemas externos.
2.  **Contêineres (Nível 2):** Divisão entre Frontend, Backend e Banco de Dados.
3.  **Componentes (Nível 3):** Detalhamento dos módulos internos da API NestJS.

## 6. Como Executar o Projeto

### Backend (`branch: backend`)
1. Clone a branch: `git clone -b backend https://github.com/rique1011/Sistema-de-Gest-o-e-Agendamento-Est-tico.git`
2. Instale: `npm install`
3. Configure o `.env` com `DATABASE_URL` e `JWT_SECRET`.
4. Migrations: `npx prisma migrate dev`
5. Inicie: `npm run start:dev`

### Frontend (`branch: frontend` )
1. Clone a branch: `git clone -b frontend https://github.com/rique1011/Sistema-de-Gest-o-e-Agendamento-Est-tico.git`
2. Instale: `npm install`
3. Inicie: `npm run dev`
4. Acesse: `http://localhost:5173`
