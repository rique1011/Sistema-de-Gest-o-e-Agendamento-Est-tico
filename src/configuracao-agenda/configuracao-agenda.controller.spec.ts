import { Test, TestingModule } from '@nestjs/testing';
import { ConfiguracaoAgendaController } from './configuracao-agenda.controller';
import { ConfiguracaoAgendaService } from './configuracao-agenda.service';

describe('ConfiguracaoAgendaController', () => {
  let controller: ConfiguracaoAgendaController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ConfiguracaoAgendaController],
      providers: [ConfiguracaoAgendaService],
    }).compile();

    controller = module.get<ConfiguracaoAgendaController>(ConfiguracaoAgendaController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
