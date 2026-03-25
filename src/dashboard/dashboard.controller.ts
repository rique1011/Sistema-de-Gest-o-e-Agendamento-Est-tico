import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { ApiBearerAuth, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from 'src/auth/auth.guard';

@ApiTags('Dashboard (Painel Inicial)')
@ApiBearerAuth()
@UseGuards(AuthGuard) // Protege a rota para só a sua mãe (admin) acessar
@Controller('dashboard')
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get('resumo')
  @ApiOperation({ summary: 'Retorna as métricas e faturamento previstos para o dia' })
  @ApiQuery({ name: 'data', example: '2026-03-25', description: 'Data para consultar o caixa e a agenda' })
  getResumo(@Query('data') data: string) {
    return this.dashboardService.getResumoDoDia(data);
  }
}