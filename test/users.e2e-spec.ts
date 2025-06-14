import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { AppModule } from 'src/app.module';
import { PrismaService } from 'src/prisma/prisma.service';
import * as request from 'supertest';
import * as bcrypt from 'bcryptjs';

describe('Users (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let jwtToken: string;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
    await app.init();

    prisma = app.get(PrismaService);

    await prisma.user.deleteMany();

    await prisma.user.create({
      data: {
        name: 'Admin Test',
        email: 'admin@test.com',
        password: await bcrypt.hash('admin', 10),
        role: 'ADMIN',
      },
    });

    const res = await request(app.getHttpServer()).post('/auth/login').send({
      email: 'admin@test.com',
      password: 'admin',
    });

    jwtToken = res.body.access_token;
  });

  afterAll(async () => {
    await prisma.user.deleteMany();
    await prisma.$disconnect();
    await app.close();
  });

  it('/users (POST) - criar novo usuário', async () => {
    const res = await request(app.getHttpServer())
      .post('/users')
      .set('Authorization', `Bearer ${jwtToken}`)
      .send({
        name: 'User Test',
        email: 'user@test.com',
        password: '12345',
        role: 'USER',
      });

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('id');
    expect(res.body.email).toBe('user@test.com');
    expect(res.body.role).toBe('USER');
  });

  it('/users (GET) - listar todos os usuários', async () => {
    const res = await request(app.getHttpServer())
      .get('/users')
      .set('Authorization', `Bearer ${jwtToken}`);

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThanOrEqual(1);
  });

  let createdUserId: number;

  it('/users (POST) - criar usuário para testes individuais', async () => {
    const res = await request(app.getHttpServer())
      .post('/users')
      .set('Authorization', `Bearer ${jwtToken}`)
      .send({
        name: 'User Test 2',
        email: 'user2@test.com',
        password: '12345',
        role: 'USER',
      });

    expect(res.status).toBe(201);
    createdUserId = res.body.id;

    expect(res.body).toHaveProperty('id');
    expect(res.body.email).toBe('user2@test.com');
  });

  it('/users/:id (GET) - buscar usuário pelo ID', async () => {
    const res = await request(app.getHttpServer())
      .get(`/users/${createdUserId}`)
      .set('Authorization', `Bearer ${jwtToken}`);

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('id', createdUserId);
    expect(res.body).not.toHaveProperty('password');
  });

  it('/users/:id (PATCH) - atualizar usuário', async () => {
    const res = await request(app.getHttpServer())
      .patch(`/users/${createdUserId}`)
      .set('Authorization', `Bearer ${jwtToken}`)
      .send({ name: 'User Test Atualizado' });

    expect(res.status).toBe(200);
    expect(res.body.name).toBe('User Test Atualizado');
  });

  it('/users/:id (DELETE) - remover usuário', async () => {
    const res = await request(app.getHttpServer())
      .delete(`/users/${createdUserId}`)
      .set('Authorization', `Bearer ${jwtToken}`);

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('id', createdUserId);
  });

  it('/users/:id (GET) - usuário não encontrado após exclusão', async () => {
    const res = await request(app.getHttpServer())
      .get(`/users/${createdUserId}`)
      .set('Authorization', `Bearer ${jwtToken}`);

    expect(res.status).toBe(404);
  });
});
