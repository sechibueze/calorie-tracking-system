import request from 'supertest';
import { describe, expect, it } from 'vitest';
import { createApp } from '../../src/app';

const app = createApp();

describe('GET /health/live', () => {
  it('returns 200 with uptime', async () => {
    const res = await request(app).get('/health/live');
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('ok');
    expect(typeof res.body.uptimeSeconds).toBe('number');
  });
});

describe('GET /api/v1', () => {
  it('returns the success envelope with the correlation id', async () => {
    const res = await request(app).get('/api/v1');
    expect(res.status).toBe(200);
    expect(res.body).toMatchObject({ success: true, data: { name: 'calorie-api', version: 'v1' } });
    expect(res.body.correlationId).toBe(res.headers['x-correlation-id']);
  });
});

describe('correlation id', () => {
  it('echoes a valid incoming id', async () => {
    const res = await request(app).get('/api/v1').set('X-Correlation-Id', 'trace-abc-12345');
    expect(res.headers['x-correlation-id']).toBe('trace-abc-12345');
    expect(res.body.correlationId).toBe('trace-abc-12345');
  });

  it('replaces a malformed incoming id with a generated one', async () => {
    const res = await request(app).get('/api/v1').set('X-Correlation-Id', 'bad id with spaces & <script>');
    expect(res.headers['x-correlation-id']).toMatch(/^[0-9a-f-]{36}$/);
  });

  it('generates a unique id per request', async () => {
    const [a, b] = await Promise.all([request(app).get('/api/v1'), request(app).get('/api/v1')]);
    expect(a.headers['x-correlation-id']).not.toBe(b.headers['x-correlation-id']);
  });
});

describe('error envelope', () => {
  it('returns a 404 envelope for unknown routes', async () => {
    const res = await request(app).get('/api/v1/nope');
    expect(res.status).toBe(404);
    expect(res.body).toMatchObject({
      success: false,
      error: { code: 'NOT_FOUND' },
    });
    expect(res.body.correlationId).toBe(res.headers['x-correlation-id']);
  });

  it('returns 400 for malformed JSON', async () => {
    const res = await request(app)
      .post('/api/v1')
      .set('Content-Type', 'application/json')
      .send('{"broken":');
    expect(res.status).toBe(400);
    expect(res.body.error.code).toBe('BAD_REQUEST');
  });

  it('returns 413 for oversized bodies', async () => {
    const res = await request(app)
      .post('/api/v1')
      .set('Content-Type', 'application/json')
      .send(JSON.stringify({ blob: 'x'.repeat(200 * 1024) }));
    expect(res.status).toBe(413);
    expect(res.body.error.code).toBe('PAYLOAD_TOO_LARGE');
  });
});

describe('security', () => {
  it('sets helmet headers and hides x-powered-by', async () => {
    const res = await request(app).get('/api/v1');
    expect(res.headers['x-content-type-options']).toBe('nosniff');
    expect(res.headers['x-powered-by']).toBeUndefined();
  });

  it('allows configured CORS origins only', async () => {
    const allowed = await request(app)
      .options('/api/v1')
      .set('Origin', 'http://localhost:5173')
      .set('Access-Control-Request-Method', 'GET');
    expect(allowed.headers['access-control-allow-origin']).toBe('http://localhost:5173');

    const denied = await request(app)
      .options('/api/v1')
      .set('Origin', 'http://evil.example')
      .set('Access-Control-Request-Method', 'GET');
    expect(denied.headers['access-control-allow-origin']).toBeUndefined();
  });
});

describe('GET /metrics', () => {
  it('exposes Prometheus metrics including route-templated HTTP timings', async () => {
    await request(app).get('/health/live');
    await request(app).get('/definitely-missing');
    const res = await request(app).get('/metrics');
    expect(res.status).toBe(200);
    expect(res.headers['content-type']).toContain('text/plain');
    expect(res.text).toContain('http_server_request_duration_seconds_bucket');
    expect(res.text).toContain('route="/health/live"');
    expect(res.text).toContain('route="unmatched"');
    expect(res.text).toContain('process_cpu_user_seconds_total');
  });
});