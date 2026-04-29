import Fastify from 'fastify';
import { z } from 'zod';

const app = Fastify();

app.addHook('preHandler', async (req) => {
  if (!req.url.startsWith('/book/') && !req.headers.authorization) throw app.httpErrors.unauthorized();
});

const ok = async () => ({ ok: true });
app.post('/auth/register', ok); app.post('/auth/login', ok); app.post('/auth/refresh', ok); app.post('/auth/logout', ok);
app.get('/customers', ok); app.post('/customers', ok); app.get('/customers/:id', ok); app.patch('/customers/:id', ok); app.delete('/customers/:id', ok);
app.get('/vehicles', ok); app.post('/vehicles', ok); app.patch('/vehicles/:id', ok);
app.get('/vehicles/:vehicleId/services', ok); app.post('/vehicles/:vehicleId/services', ok); app.get('/vehicles/:vehicleId/services/:id', ok);
app.get('/alerts', ok); app.post('/alerts/:id/send', ok); app.post('/alerts/:id/snooze', ok);
app.get('/appointments', ok); app.post('/appointments', ok); app.patch('/appointments/:id', ok);
app.get('/book/:token', ok); app.post('/book/:token', ok);
app.post('/integrations/google-calendar/connect', ok); app.get('/integrations/google-calendar/callback', ok); app.delete('/integrations/google-calendar', ok);

const authHeaderSchema = z.object({ authorization: z.string().startsWith('Bearer ') });
export { app, authHeaderSchema };
