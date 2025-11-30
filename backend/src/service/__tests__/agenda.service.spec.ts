import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

import * as service from '../agenda.service';
import Agenda from '../../model/agenda.model';

describe('agenda.service', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  it('getPendingAppointmentRequests forwards value from model', async () => {
    const mock = [{ patient_appointment_id: 1 }];
    vi.spyOn(Agenda, 'getPendingAppointmentRequests').mockResolvedValue(mock as any);

    const res = await service.getPendingAppointmentRequests();
    expect(res).toEqual(mock);
    expect(Agenda.getPendingAppointmentRequests).toHaveBeenCalled();
  });

  it('getDoctors forwards value from model', async () => {
    const mock = [{ doctor_id: 'd1' }];
    vi.spyOn(Agenda, 'getDoctors').mockResolvedValue(mock as any);

    const res = await service.getDoctors();
    expect(res).toEqual(mock);
    expect(Agenda.getDoctors).toHaveBeenCalled();
  });

  it('getDoctorAvailability forwards args and returns model value', async () => {
    const mock = ['09:00'];
    const spy = vi.spyOn(Agenda, 'getDoctorAvailability').mockResolvedValue(mock as any);

    const res = await service.getDoctorAvailability('doc1', '2025-01-01');
    expect(spy).toHaveBeenCalledWith('doc1', '2025-01-01');
    expect(res).toEqual(mock);
  });

  it('scheduleAppointment forwards payload to model', async () => {
    const payload = { patientAppointmentId: 1, doctorId: 'd', dateHour: 'd', duration: 45, appointmentType: 'PRESENCIAL' as const };
    const mock = { scheduled: true };
    vi.spyOn(Agenda, 'scheduleAppointment').mockResolvedValue(mock as any);

    const res = await service.scheduleAppointment(payload as any);
    expect(Agenda.scheduleAppointment).toHaveBeenCalledWith(payload);
    expect(res).toEqual(mock);
  });

  it('createAppointment forwards payload to model', async () => {
    const payload = { patientId: 'p1', doctorId: 'd1', dateHour: 'd', duration: 45, appointmentType: 'PRESENCIAL' as const };
    const mock = { created: true };
    vi.spyOn(Agenda, 'createAppointment').mockResolvedValue(mock as any);

    const res = await service.createAppointment(payload as any);
    expect(Agenda.createAppointment).toHaveBeenCalledWith(payload);
    expect(res).toEqual(mock);
  });
});
