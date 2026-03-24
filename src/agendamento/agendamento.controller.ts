import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { ApiQuery } from '@nestjs/swagger'; // Importe isso para o Swagger
import { AgendamentoService } from './agendamento.service';
import { CreateAgendamentoDto } from './dto/create-agendamento.dto';
import { UpdateAgendamentoDto } from './dto/update-agendamento.dto';

@Controller('agendamento')
export class AgendamentoController {
  constructor(private readonly agendamentoService: AgendamentoService) {}

  @Post()
  create(@Body() createAgendamentoDto: CreateAgendamentoDto) {
    return this.agendamentoService.create(createAgendamentoDto);
  }

  // --- NOVA ROTA GET COM FILTRO ---
  @Get()
  @ApiQuery({ name: 'data', required: false, description: 'Filtra por data no formato YYYY-MM-DD (ex: 2026-04-15)' })
  findAll(@Query('data') data?: string) {
    return this.agendamentoService.findAll(data);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.agendamentoService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateAgendamentoDto: UpdateAgendamentoDto) {
    return this.agendamentoService.update(id, updateAgendamentoDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.agendamentoService.remove(id);
  }
}