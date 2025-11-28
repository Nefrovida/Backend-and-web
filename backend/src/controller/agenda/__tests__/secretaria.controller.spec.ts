import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

import * as controller from '../secretaria.controller';
import * as agendaService from '../../../service/agenda.service';

function makeRes() {
  const json = vi.fn();
  const status = vi.fn().mockImplementation(() => ({ json }));
  return { json, status } as any;
}

describe('secretaria.controller', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  describe('getPendingAppointmentRequests', () => {
    it('returns pending requests on success', async () => {
      const mockData = [{ id: 'req-1' }];
      vi.spyOn(agendaService, 'getPendingAppointmentRequests').mockResolvedValue(mockData as any);

      const req = {} as any;
      const res = makeRes();

      await controller.getPendingAppointmentRequests(req, res);

      expect(res.json).toHaveBeenCalledWith(mockData);
    });

    it('returns 500 on service error', async () => {
      vi.spyOn(agendaService, 'getPendingAppointmentRequests').mockRejectedValue(new Error('boom'));

      const req = {} as any;
      const res = makeRes();

      await controller.getPendingAppointmentRequests(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.status().json).toHaveBeenCalledWith({ error: 'Failed to fetch pending appointment requests' });
    });
  });

  describe('getDoctors', () => {
    it('returns doctors list on success', async () => {
      const mockData = [{ id: 'doc-1' }];
      vi.spyOn(agendaService, 'getDoctors').mockResolvedValue(mockData as any);

      const req = {} as any;
      const res = makeRes();

      await controller.getDoctors(req, res);

      expect(res.json).toHaveBeenCalledWith(mockData);
    });

    it('returns 500 on service error', async () => {
      vi.spyOn(agendaService, 'getDoctors').mockRejectedValue(new Error('boom'));

      const req = {} as any;
      const res = makeRes();

      await controller.getDoctors(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.status().json).toHaveBeenCalledWith({ error: 'Failed to fetch doctors' });
    });
  });

  describe('getDoctorAvailability', () => {
    it('returns 400 when missing query params', async () => {
      const req = { query: {} } as any;
      const res = makeRes();

      await controller.getDoctorAvailability(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.status().json).toHaveBeenCalledWith({ error: 'doctorId and date are required' });
    });

    it('returns availability on success', async () => {
      const availability = [{ slot: '09:00' }];
      vi.spyOn(agendaService, 'getDoctorAvailability').mockResolvedValue(availability as any);

      const req = { query: { doctorId: 'doc-1', date: '2025-01-01' } } as any;
      const res = makeRes();

      await controller.getDoctorAvailability(req, res);

      expect(res.json).toHaveBeenCalledWith(availability);
    });

    it('returns 500 on service error', async () => {
      vi.spyOn(agendaService, 'getDoctorAvailability').mockRejectedValue(new Error('failed'));

      const req = { query: { doctorId: 'doc-1', date: '2025-01-01' } } as any;
      const res = makeRes();

      await controller.getDoctorAvailability(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.status().json).toHaveBeenCalledWith({ error: 'Failed to fetch doctor availability' });
    });
  });

  describe('scheduleAppointment', () => {
    it('returns 400 when missing required body fields', async () => {
      const req = { body: {} } as any;
      const res = makeRes();

      await controller.scheduleAppointment(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.status().json).toHaveBeenCalledWith({ error: 'patientAppointmentId, doctorId, and dateHour are required' });
    });

    it('schedules an appointment on success', async () => {
      const scheduled = { id: 'sch-1', patientAppointmentId: 'pa-1' };
      vi.spyOn(agendaService, 'scheduleAppointment').mockResolvedValue(scheduled as any);

      const req = { body: { patientAppointmentId: 'pa-1', doctorId: 'doc-1', dateHour: '2025-02-01T09:00:00Z' } } as any;
      const res = makeRes();

      await controller.scheduleAppointment(req, res);

      expect(res.json).toHaveBeenCalledWith(scheduled);
    });

    it('returns 500 on service error', async () => {
      vi.spyOn(agendaService, 'scheduleAppointment').mockRejectedValue(new Error('err'));

      const req = { body: { patientAppointmentId: 'pa-1', doctorId: 'doc-1', dateHour: '2025-02-01T09:00:00Z' } } as any;
      const res = makeRes();

      await controller.scheduleAppointment(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.status().json).toHaveBeenCalledWith({ error: 'Failed to schedule appointment' });
    });
  });

  describe('createAppointment', () => {
    it('returns 400 when missing required body fields', async () => {
      const req = { body: {} } as any;
      const res = makeRes();

      await controller.createAppointment(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.status().json).toHaveBeenCalledWith({ error: 'patientId, doctorId, and dateHour are required' });
    });

    it('creates an appointment on success', async () => {
      const created = { id: 'a-1', patientId: 'patient-1' };
      vi.spyOn(agendaService, 'createAppointment').mockResolvedValue(created as any);

      const req = { body: { patientId: 'patient-1', doctorId: 'doc-1', dateHour: '2025-02-01T10:00:00Z' } } as any;
      const res = makeRes();

      await controller.createAppointment(req, res);

      expect(res.json).toHaveBeenCalledWith(created);
    });

    it('returns 500 on service error', async () => {
      vi.spyOn(agendaService, 'createAppointment').mockRejectedValue(new Error('x'));

      const req = { body: { patientId: 'patient-1', doctorId: 'doc-1', dateHour: '2025-02-01T10:00:00Z' } } as any;
      const res = makeRes();

      await controller.createAppointment(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.status().json).toHaveBeenCalledWith({ error: 'Failed to create appointment' });
    });
  });
});
