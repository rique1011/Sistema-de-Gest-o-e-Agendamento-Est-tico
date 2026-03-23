export class CreateAgendamentoDto {
  data_inicio: string; // Vamos receber como string (ISO 8601) e converter no Service
  data_fim: string;
  pacienteId: string;
  servicoId: string;
}