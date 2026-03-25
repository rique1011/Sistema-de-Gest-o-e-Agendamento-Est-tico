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

  it('/auth/login (POST) - Deve retornar um token com credenciais válidas', () => {
    return request(app.getHttpServer())
      .post('/auth/login')
      .send({
        email: 'admin@bioschedule.com', // Use o email que você criou no banco
        senha: 'senha123',
      })
      .expect(201)
      .then((response) => {
        expect(response.body).toHaveProperty('access_token');
      });
  });

  it('/paciente (GET) - Deve permitir acesso com Token válido', async () => {
    // 1. Primeiro fazemos login para pegar o token
    const loginResponse = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ email: 'admin@bioschedule.com', senha: 'senha123' });

    const token = loginResponse.body.access_token;

    // 2. Usamos o token para acessar a rota protegida
    return request(app.getHttpServer())
      .get('/paciente')
      .set('Authorization', `Bearer ${token}`) // Simula o cadeado do Swagger
      .expect(200);
  });

  it('/paciente (POST) - Deve retornar 400 ao enviar dados inválidos', async () => {
    // 1. Primeiro pegamos o token
    const loginRes = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ email: 'admin@bioschedule.com', senha: 'senha123' });

    const token = loginRes.body.access_token; // <--- Aqui está o segredo

    // 2. Agora usamos o token na requisição
    return request(app.getHttpServer())
      .post('/paciente')
      .set('Authorization', `Bearer ${token}`)
      .send({ nome: '', email: 'invalido' })
      .expect(400);
  });
});