import { Test, TestingModule } from '@nestjs/testing';
import { ConfiguracaoAgendaService } from './configuracao-agenda.service';

describe('ConfiguracaoAgendaService', () => {
  let service: ConfiguracaoAgendaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ConfiguracaoAgendaService],
    }).compile();

    service = module.get<ConfiguracaoAgendaService>(ConfiguracaoAgendaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
