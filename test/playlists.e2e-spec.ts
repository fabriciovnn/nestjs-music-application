import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { AppModule } from 'src/app.module';
import { PrismaService } from 'src/prisma/prisma.service';
import * as request from 'supertest';

describe('Playlists (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let jwtToken: string;
  let playlistId: number;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
    await app.init();

    prisma = app.get(PrismaService);

    await prisma.playlist.deleteMany();
    await prisma.user.deleteMany();

    const loginRes = await request(app.getHttpServer())
      .post('/auth/register')
      .send({
        name: 'User',
        email: 'user-2@test.com',
        password: '12345',
      });

    jwtToken = loginRes.body.access_token;

    await prisma.user.findUnique({
      where: { email: 'user-2@test.com' },
    });
  });

  afterAll(async () => {
    await prisma.$disconnect();
    await app.close();
  });

  it('/playlists (POST) - criar playlist', async () => {
    const res = await request(app.getHttpServer())
      .post('/playlists')
      .set('Authorization', `Bearer ${jwtToken}`)
      .send({
        name: 'Minha Playlist',
        genre: 'Rock',
        musics: ['musica 1', 'musica 2'],
      });

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('id');
    expect(res.body.name).toBe('Minha Playlist');
    playlistId = res.body.id;
  });

  it('/playlists (GET) - listar playlists do usuário', async () => {
    const res = await request(app.getHttpServer())
      .get('/playlists')
      .set('Authorization', `Bearer ${jwtToken}`);

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThanOrEqual(1);
  });

  it('/playlists/:id (PATCH) - editar playlist', async () => {
    const res = await request(app.getHttpServer())
      .patch(`/playlists/${playlistId}`)
      .set('Authorization', `Bearer ${jwtToken}`)
      .send({
        name: 'Playlist Editada',
      });

    expect(res.status).toBe(200);
    expect(res.body.name).toBe('Playlist Editada');
  });

  it('/playlists/:id (DELETE) - deletar playlist', async () => {
    const res = await request(app.getHttpServer())
      .delete(`/playlists/${playlistId}`)
      .set('Authorization', `Bearer ${jwtToken}`);

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('id');
  });
});
