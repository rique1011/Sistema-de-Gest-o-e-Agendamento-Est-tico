# Sistema de Gestão e Agendamento Estético

É uma plataforma modular projetada para clínicas de biomedicina estética, com uma arquitetura flexível que permite adaptação para qualquer setor que dependa de agendamentos e prontuários (como odontologia, estúdios de tatuagem ou consultórios).

---

## 1. Domínio do Problema

Clínicas de estética enfrentam desafios na gestão de horários e na manutenção de históricos detalhados. O sistema visa resolver:
* **Fragmentação de dados:** Centraliza prontuários, fotos de evolução e agendamentos em um só lugar.
* **Ociosidade e Conflitos:** Otimiza a agenda com base na duração real de cada procedimento técnico.
* **Falta de Histórico:** Mantém um registro cronológico de intervenções para segurança jurídica e acompanhamento de resultados.

---

## 2. Funcionalidades Principais (Operations)

Para garantir a eficiência e a adaptabilidade, o sistema foca em 5 operações essenciais:

1.  **Agenda Dinâmica com Bloqueio de Conflitos:** O sistema não permite sobreposição de horários. Ao tentar agendar, o backend valida se o profissional ou a sala estão disponíveis no intervalo exato entre a `data_inicio` e `data_fim`.
2.  **Cálculo Automático de Tempo por Procedimento:** O usuário escolhe o serviço (ex: Limpeza de Pele - 60min) e o sistema calcula automaticamente o horário de término, otimizando as janelas de atendimento sem necessidade de cálculo manual.
3.  **Prontuário de Evolução Estética:** Permite o registro de anamnese e o upload de fotos para acompanhamento de resultados (Antes e Depois), vinculando cada registro ao histórico do paciente.
4.  **Gestão de Status e Fluxo de Atendimento:** Controle visual do ciclo do cliente (Agendado -> Em Atendimento -> Concluído -> Faltou), gerando métricas de produtividade para a clínica.
5.  **Motor de Serviços Configurável (Adaptabilidade):** Interface para cadastrar qualquer tipo de serviço com tempos e valores variados, permitindo que o sistema mude de "Estética" para "Fisioterapia" ou "Barbearia" apenas alterando o catálogo.

---

## 3. Requisitos do Sistema

### ✅ Requisitos Funcionais (RF)
* **RF01 - Gestão de Pacientes:** Cadastro completo (CRUD) com histórico de procedimentos realizados.
* **RF02 - Catálogo de Serviços:** Cadastro de procedimentos com definição de preço e tempo de duração.
* **RF03 - Agenda Inteligente:** Criação de agendamentos vinculando paciente e serviço.
* **RF04 - Controle de Status:** Alteração de estados do agendamento em tempo real.

### 🛠 Requisitos Não Funcionais (RNF)
* **RNF01 - Persistência de Dados:** Uso de banco de dados relacional para garantir a integridade referencial.
* **RNF02 - Interface Responsiva:** O sistema deve ser utilizável em tablets e desktops.
* **RNF03 - Segurança:** Implementação de autenticação para proteger dados sensíveis de saúde.
* **RNF04 - Arquitetura Modular:** Código estruturado para permitir a troca de regras de negócio facilmente.

---

## 4. Arquitetura e Modelagem

O sistema segue o padrão de arquitetura modular (MVC), separando interface, lógica de negócio e persistência.

### Modelagem de Dados (Entidades Principais)

1.  **Paciente:** Dados pessoais e de contato (`id`, `nome`, `cpf`, `telefone`).
2.  **Servico:** Catálogo da clínica (`id`, `nome`, `duracao_minutos`, `valor`).
3.  **Agendamento:** Entidade central (`id`, `paciente_id`, `servico_id`, `data_inicio`, `data_fim`, `status`).

---

## 5. Tecnologias Utilizadas

| Tecnologia | Função | Justificativa |
| :--- | :--- | :--- |
| **Next.js / React** | Frontend | Agilidade no desenvolvimento e excelente experiência de usuário (UX). |
| **Node.js (NestJS)** | Backend | Estrutura robusta e escalável, ideal para sistemas de gestão. |
| **PostgreSQL** | Banco de Dados | Confiabilidade para dados estruturados e suporte a consultas complexas. |
| **Prisma ORM** | Integração | Facilita a manutenção do banco e garante tipagem segura (Type-safety). |

---

## 6. Organização de Tarefas (Divisão da Dupla)

### **Membro A: Core & Backend**
- [ ] Modelagem do Banco de Dados e Migrations.
- [ ] Desenvolvimento da API de CRUD (Pacientes e Serviços).
- [ ] Implementação da lógica de validação de conflitos de horários.

### **Membro B: Interface & UX**
- [ ] Criação do Design System e Protótipo da Agenda.
- [ ] Desenvolvimento do Dashboard e Calendário Interativo.
- [ ] Integração do Frontend com as APIs desenvolvidas.

---

## 📐 Arquitetura (Modelo C4)

Os diagramas de arquitetura no modelo C4 estão disponíveis nos arquivos abaixo:

- [Nível 1 - Contexto](./bioschedule_c4_nivel1_contexto.puml)
- [Nível 2 - Contêineres](./bioschedule_c4_nivel2_containers.puml)
- [Nível 3 - Componentes](./bioschedule_c4_nivel3_componentes.puml)

> Para visualizar, importe os arquivos `.puml` no [PlantUML Online](https://www.plantuml.com/plantuml/uml/) ou use a extensão PlantUML no VSCode.
