import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiQuery, ApiTags } from '@nestjs/swagger'; // Adicionamos ApiBearerAuth e ApiTags
import { AuthGuard } from '../auth/auth.guard';
import { AgendamentoService } from './agendamento.service';
import { CreateAgendamentoDto } from './dto/create-agendamento.dto';
import { UpdateAgendamentoDto } from './dto/update-agendamento.dto';

@ApiTags('agendamento') // Agrupa as rotas de agendamento no Swagger
@ApiBearerAuth()        // Ativa o cadeado de segurança para este controller
@UseGuards(AuthGuard)   // Aplica a regra de segurança (JWT)
@Controller('agendamento')
export class AgendamentoController {
  constructor(private readonly agendamentoService: AgendamentoService) {}

  @Post()
  create(@Body() createAgendamentoDto: CreateAgendamentoDto) {
    return this.agendamentoService.create(createAgendamentoDto);
  }

  @Get()
  @ApiQuery({ name: 'data', required: false, description: 'Filtra por data (YYYY-MM-DD)' })
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