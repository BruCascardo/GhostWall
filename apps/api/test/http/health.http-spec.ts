// Pruebas HTTP de la aplicación Nest completa en memoria (sin red externa ni base de datos).
import type { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import type { App } from 'supertest/types';
import { afterAll, beforeAll, describe, it } from 'vitest';
import { AppModule } from '../../src/app.module';

describe('api HTTP', () => {
  let app: INestApplication<App>;

  beforeAll(async () => {
    const modulo = await Test.createTestingModule({ imports: [AppModule] }).compile();
    app = modulo.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('GET /health responde 200 con {"status":"ok"}', async () => {
    await request(app.getHttpServer()).get('/health').expect(200, { status: 'ok' });
  });

  it('una ruta inexistente responde 404', async () => {
    await request(app.getHttpServer()).get('/no-existe').expect(404);
  });
});
