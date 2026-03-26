import { Controller, Get, Post, Body } from '@nestjs/common';
import { ConfiguracaoAgendaService } from './configuracao-agenda.service';
import { CreateConfiguracaoAgendaDto } from './dto/create-configuracao-agenda.dto';

@Controller('configuracao-agenda')
export class ConfiguracaoAgendaController {
  constructor(private readonly configuracaoAgendaService: ConfiguracaoAgendaService) {}

  @Post()
  salvarConfiguracoes(@Body() createDto: CreateConfiguracaoAgendaDto) {
    // O React vai enviar o objeto { horarios: [...] }
    return this.configuracaoAgendaService.salvar(createDto);
  }

  @Get()
  buscarConfiguracoes() {
    // Retorna os horários salvos para preencher a tela no React
    return this.configuracaoAgendaService.buscarTodas();
  }
}