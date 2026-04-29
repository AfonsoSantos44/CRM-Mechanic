import { describe, it, expect } from 'vitest';
import { calculateAlerts } from './index';

describe('calculateAlerts', () => {
  it('reduces km interval for high mileage vehicles', () => {
    const alerts = calculateAlerts(
      { id: 'v1', registeredAt: new Date('2024-01-01'), kmAtRegistration: 10000, estimatedKmPerYear: 15000 },
      [
        { serviceDate: new Date('2024-01-01'), kmAtService: 10000, serviceTypes: ['OIL_CHANGE'] },
        { serviceDate: new Date('2025-01-01'), kmAtService: 40000, serviceTypes: ['OIL_CHANGE'] }
      ]
    );
    const oil = alerts.find(a => a.alertType === 'OIL_CHANGE');
    expect(oil?.triggerKm).toBe(52000);
  });
});
