import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger'; // Adicionado ApiOperation
import { AuthGuard } from '../auth/auth.guard';
import { AgendamentoService } from './agendamento.service';
import { CreateAgendamentoDto } from './dto/create-agendamento.dto';
import { UpdateAgendamentoDto } from './dto/update-agendamento.dto';

@ApiTags('Agendamentos') // Agrupa as rotas no Swagger
@ApiBearerAuth()        // Ativa o cadeado de segurança
@UseGuards(AuthGuard)   // Aplica a regra de segurança (JWT)
@Controller('agendamento')
export class AgendamentoController {
  constructor(private readonly agendamentoService: AgendamentoService) {}

  // 1. ROTAS FIXAS PRIMEIRO (Para evitar conflito com o :id)
  @Get('disponibilidade')
  @ApiOperation({ summary: 'Busca os horários livres e bloqueados de um dia específico' })
  @ApiQuery({ name: 'data', example: '2026-03-25', description: 'Data no formato YYYY-MM-DD' })
  getDisponibilidade(@Query('data') data: string) {
    return this.agendamentoService.getDisponibilidade(data);
  }

  // 2. ROTAS PADRÃO
  @Post()
  @ApiOperation({ summary: 'Cria um novo agendamento' })
  create(@Body() createAgendamentoDto: CreateAgendamentoDto) {
    return this.agendamentoService.create(createAgendamentoDto);
  }

  @Get()
  @ApiOperation({ summary: 'Lista os agendamentos (com filtro opcional de data)' })
  @ApiQuery({ name: 'data', required: false, description: 'Filtra por data (YYYY-MM-DD)' })
  findAll(@Query('data') data?: string) {
    return this.agendamentoService.findAll(data);
  }

  // 3. ROTAS COM PARÂMETRO DINÂMICO (:id) POR ÚLTIMO
  @Get(':id')
  @ApiOperation({ summary: 'Busca um agendamento específico pelo ID' })
  findOne(@Param('id') id: string) {
    return this.agendamentoService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Atualiza os dados gerais de um agendamento' })
  update(@Param('id') id: string, @Body() updateAgendamentoDto: UpdateAgendamentoDto) {
    return this.agendamentoService.update(id, updateAgendamentoDto);
  }

  @Patch(':id/status')
  @ApiOperation({ summary: 'Altera exclusivamente o STATUS de um agendamento (Ex: CANCELADO)' })
  alterarStatus(
    @Param('id') id: string,
    @Body() updateDto: UpdateAgendamentoDto,
  ) {
    return this.agendamentoService.alterarStatus(id, updateDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Remove um agendamento do banco (Use com cautela)' })
  remove(@Param('id') id: string) {
    return this.agendamentoService.remove(id);
  }
}