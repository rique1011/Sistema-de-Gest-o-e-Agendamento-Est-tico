export class CreatePacienteDto {
  nome: string;
  cpf: string;
  telefone: string;
  email?: string; // O ponto de interrogação indica que é opcional
}