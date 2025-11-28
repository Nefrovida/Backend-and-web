import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import express from 'express';
import request from 'supertest';

// We'll mock the JWT utility per-test to simulate authenticated users

vi.mock('src/middleware/rbac.middleware', async () => {
  return {
    requirePrivileges: (required: string[]) => (req: any, res: any, next: any) => {
      const userPrivs: string[] = req.user?.privileges ?? [];
      const ok = required.every((p) => userPrivs.includes(p));
      if (!ok) {
        return next(new ForbiddenError('Insufficient privileges'));
      }
      next();
    },
  };
});
// router and service will be dynamically imported inside each test after mocks are set
import { errorHandler } from '../../middleware/error.middleware';
import { UnauthorizedError, ForbiddenError } from '../../util/errors.util';

async function createApp() {
  // Import router once modules are mocked appropriately
  const { default: router } = await import('../../routes/agenda.routes');
  const app = express();
  app.use(express.json());
  app.use('/api/agenda', router);
  app.use(errorHandler);
  return app;
}

describe('agenda.routes (integration)', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  it('GET /pending-requests - returns requests when authorized', async () => {
    const mock = [{ patient_appointment_id: 1 }];

    vi.resetModules();
    vi.doMock('src/middleware/auth.middleware', () => ({
      authenticate: (req: any, res: any, next: any) => {
        req.user = { userId: 'u1', roleId: 6, privileges: ['VIEW_APPOINTMENTS', 'CREATE_APPOINTMENTS'] };
        next();
      },
    }));

    const agendaService = await import('../../service/agenda.service');
    vi.spyOn(agendaService, 'getPendingAppointmentRequests').mockResolvedValue(mock as any);

    const app = await createApp();
    const res = await request(app).get('/api/agenda/pending-requests').set('Authorization', 'Bearer test');

    expect(res.status).toBe(200);
    expect(res.body).toEqual(mock);
  });

  it('GET /pending-requests - forbidden when missing privileges', async () => {
    vi.resetModules();
    vi.doMock('src/middleware/auth.middleware', () => ({
      authenticate: (req: any, res: any, next: any) => {
        req.user = { userId: 'u2', roleId: 6, privileges: [] };
        next();
      },
    }));

    const app = await createApp();
    const res = await request(app).get('/api/agenda/pending-requests').set('Authorization', 'Bearer test');

    expect(res.status).toBe(403);
    expect(res.body).toHaveProperty('success', false);
    expect(res.body.error).toHaveProperty('message');
  });

  it('GET /pending-requests - unauthorized when authenticate throws', async () => {
    vi.resetModules();
    // Simulate authenticate failing
    vi.doMock('src/middleware/auth.middleware', () => ({
      authenticate: (req: any, res: any, next: any) => {
        next(new UnauthorizedError('No token'));
      },
    }));

    const app = await createApp();
    const res = await request(app).get('/api/agenda/pending-requests').set('Authorization', 'Bearer test');

    expect(res.status).toBe(401);
    expect(res.body).toHaveProperty('success', false);
    expect(res.body.error).toHaveProperty('message');
  });

  it('POST /schedule-appointment - returns 400 when missing body', async () => {
    vi.resetModules();
    vi.doMock('src/middleware/auth.middleware', () => ({
      authenticate: (req: any, res: any, next: any) => {
        req.user = { userId: 'u3', roleId: 6, privileges: ['UPDATE_APPOINTMENTS', 'CREATE_APPOINTMENTS'] };
        next();
      },
    }));

    const app = await createApp();
    const res = await request(app).post('/api/agenda/schedule-appointment').set('Authorization', 'Bearer test').send({});

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty('error');
  });

  it('POST /create-appointment - creates when authorized and payload ok', async () => {
    const created = { id: 'ap-1' };
    vi.resetModules();
    vi.doMock('src/middleware/auth.middleware', () => ({
      authenticate: (req: any, res: any, next: any) => {
        req.user = { userId: 'u4', roleId: 6, privileges: ['CREATE_APPOINTMENTS'] };
        next();
      },
    }));

    const agendaService = await import('../../service/agenda.service');
    vi.spyOn(agendaService, 'createAppointment').mockResolvedValue(created as any);

    const app = await createApp();
    const payload = { patientId: 'p1', doctorId: 'd1', dateHour: '2025-02-01T10:00:00Z' };
    const res = await request(app).post('/api/agenda/create-appointment').set('Authorization', 'Bearer test').send(payload);

    expect(res.status).toBe(200);
    expect(res.body).toEqual(created);
  });
});
