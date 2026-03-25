import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest'; // Importamos como 'request'
import { AppModule } from './../src/app.module';

describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/ (GET) - Deve estar online', () => {
    // Agora o nome 'request' existe e será reconhecido!
    return request(app.getHttpServer())
      .get('/')
      .expect(200);
  });

  it('/agendamento (GET) - Deve barrar acesso sem Token (401)', () => {
    return request(app.getHttpServer())
      .get('/agendamento')
      .expect(401);
  });

  afterAll(async () => {
    await app.close();
  });
});