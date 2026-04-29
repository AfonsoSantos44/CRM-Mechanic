export type AlertType = 'OIL_CHANGE'|'TIRES'|'FILTERS'|'BRAKES'|'BATTERY'|'ANNUAL_CHECK'|'TIMING_BELT'|'SPARK_PLUGS';
export type AlertStatus = 'PENDING'|'SENT'|'ACKNOWLEDGED'|'SNOOZED'|'CANCELLED';
export interface Vehicle { id: string; registeredAt: Date; kmAtRegistration: number; estimatedKmPerYear: number; }
export interface ServiceRecord { serviceDate: Date; kmAtService: number; serviceTypes: string[]; }
export interface AlertSchedule { vehicleId: string; alertType: AlertType; triggerKm?: number; triggerDate?: Date; status: AlertStatus; bookingTokenExpiresAt: Date; }

export const MAINTENANCE_RULES: Record<AlertType, { kmInterval?: number; monthInterval?: number }> = {
  OIL_CHANGE: { kmInterval: 15000, monthInterval: 12 }, FILTERS: { kmInterval: 15000, monthInterval: 12 },
  TIRES: { kmInterval: 10000, monthInterval: 6 }, BRAKES: { kmInterval: 40000 }, BATTERY: { monthInterval: 48 },
  ANNUAL_CHECK: { monthInterval: 24 }, TIMING_BELT: { kmInterval: 120000, monthInterval: 96 }, SPARK_PLUGS: { kmInterval: 60000 }
};

const addMonths = (d: Date, m: number) => new Date(new Date(d).setMonth(d.getMonth() + m));

export function calculateAlerts(vehicle: Vehicle, serviceRecords: ServiceRecord[]): AlertSchedule[] {
  const sorted = [...serviceRecords].sort((a,b)=>a.serviceDate.getTime()-b.serviceDate.getTime());
  let estimated = vehicle.estimatedKmPerYear;
  if (sorted.length >= 2) {
    const first = sorted[0], last = sorted[sorted.length-1];
    const days = Math.max(1,(last.serviceDate.getTime()-first.serviceDate.getTime())/(1000*60*60*24));
    estimated = Math.round(((last.kmAtService-first.kmAtService)/days)*365);
  }
  const now = new Date();
  const baseDate = sorted.at(-1)?.serviceDate ?? vehicle.registeredAt;
  const baseKm = sorted.at(-1)?.kmAtService ?? vehicle.kmAtRegistration;
  return (Object.keys(MAINTENANCE_RULES) as AlertType[]).map((alertType)=>{
    const rule = MAINTENANCE_RULES[alertType];
    const adaptiveKm = rule.kmInterval ? Math.round(rule.kmInterval * (estimated > 25000 ? 0.8 : 1)) : undefined;
    const byKm = adaptiveKm ? baseKm + adaptiveKm : undefined;
    const byDate = rule.monthInterval ? addMonths(baseDate, rule.monthInterval) : undefined;
    const preferDate = estimated < 8000 && byDate;
    return {
      vehicleId: vehicle.id, alertType, status: 'PENDING',
      triggerKm: preferDate ? undefined : byKm,
      triggerDate: preferDate ? byDate : byDate,
      bookingTokenExpiresAt: new Date(now.getTime()+7*24*60*60*1000)
    };
  });
}
