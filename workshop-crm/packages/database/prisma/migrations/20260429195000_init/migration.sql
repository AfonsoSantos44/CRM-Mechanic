-- RLS policies by workshop session variable
ALTER TABLE "Workshop" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Technician" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Customer" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Vehicle" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "ServiceRecord" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "AlertSchedule" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Appointment" ENABLE ROW LEVEL SECURITY;

CREATE POLICY workshop_isolation_workshop ON "Workshop"
USING (id::text = current_setting('app.current_workshop_id', true));

CREATE POLICY workshop_isolation_technician ON "Technician"
USING ("workshopId"::text = current_setting('app.current_workshop_id', true));

CREATE POLICY workshop_isolation_customer ON "Customer"
USING ("workshopId"::text = current_setting('app.current_workshop_id', true));

CREATE POLICY workshop_isolation_vehicle ON "Vehicle"
USING ("workshopId"::text = current_setting('app.current_workshop_id', true));

CREATE POLICY workshop_isolation_service ON "ServiceRecord"
USING ("workshopId"::text = current_setting('app.current_workshop_id', true));

CREATE POLICY workshop_isolation_alert ON "AlertSchedule"
USING (EXISTS (
  SELECT 1 FROM "Vehicle" v
  WHERE v.id = "AlertSchedule"."vehicleId"
    AND v."workshopId"::text = current_setting('app.current_workshop_id', true)
));

CREATE POLICY workshop_isolation_appointment ON "Appointment"
USING ("workshopId"::text = current_setting('app.current_workshop_id', true));
